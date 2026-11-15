"use client";

import Icon from "@/components/ui/Icon";
import { addItineraryItem, updateItineraryItem } from "@/lib/itinerary-storage";
import { isDateInTripRange } from "@/lib/itinerary-dates";
import type { CreateItineraryInput, ItineraryCategory, ItineraryFormProps, UpdateItineraryInput } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { FormEvent } from "react";

type FieldErrors = Partial<Record<"title" | "date", string>>;

export function ItineraryForm(prop: ItineraryFormProps) {
    const [formData, setFormData] = useState<CreateItineraryInput>(
        prop.mode === "create" ? {
            tripId: prop.trip.id,
            date: prop.initialDate && isDateInTripRange(prop.initialDate, prop.trip.startDate, prop.trip.endDate)
                ? prop.initialDate
                : prop.trip.startDate,
            time: null,
            title: "",
            category: "other",
            memo: ""
        } : {
            tripId: prop.trip.id,
            date: prop.item.date,
            time: prop.item.time,
            title: prop.item.title,
            category: prop.item.category,
            memo: prop.item.memo
        }
    );
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const savingRef = useRef(false);
    const router = useRouter();

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (savingRef.current) return;

        const errors: FieldErrors = {};
        if (formData.title.trim() === "") {
            errors.title = "予定名を入力してください";
        }
        if (formData.date === "") {
            errors.date = "日付を入力してください";
        } else if (formData.date < prop.trip.startDate || formData.date > prop.trip.endDate) {
            errors.date = "日付は旅行期間内で指定してください";
        }
        setFieldErrors(errors);
        setError("");
        if (errors.title || errors.date) {
            const field = event.currentTarget.elements.namedItem(errors.title ? "title" : "date");
            if (field instanceof HTMLInputElement) field.focus();
            return;
        }

        const validatedData: CreateItineraryInput = {
            ...formData,
            title: formData.title.trim(),
        };

        savingRef.current = true;
        setIsSaving(true);
        try {
            if (prop.mode === "create") {
                addItineraryItem(validatedData);
            } else {
                const updateInput: UpdateItineraryInput = {
                    date: validatedData.date,
                    time: validatedData.time,
                    title: validatedData.title,
                    category: validatedData.category,
                    memo: validatedData.memo
                };
                const result = updateItineraryItem(prop.item.id, updateInput);
                if (!result) {
                    setError("編集対象のスケジュールが見つかりません");
                    savingRef.current = false;
                    setIsSaving(false);
                    return;
                }
            }
            router.push(`/trips/${prop.trip.id}`);
        } catch (err) {
            console.error(err);
            setError("スケジュールの保存に失敗しました。もう一度お試しください");
            savingRef.current = false;
            setIsSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate aria-busy={isSaving} className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-8 border-b border-line pb-6">
                <h2 className="text-lg font-semibold">予定の基本情報</h2>
                <p className="mt-2 text-sm leading-6 text-muted">予定名と日付は必須です。時刻やメモは後から追加できます。</p>
            </div>
            <fieldset disabled={isSaving} className="min-w-0 space-y-6 disabled:opacity-70">
                <legend className="sr-only">予定の入力項目</legend>
                <div>
                    <label htmlFor="title" className="field-label">予定名 <span className="text-xs font-normal text-muted">必須</span></label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        required
                        className="field"
                        placeholder="例：清水寺を散策する"
                        aria-invalid={!!fieldErrors.title}
                        aria-describedby={fieldErrors.title ? "itinerary-title-error" : undefined}
                        value={formData.title}
                        onChange={e => {
                            setFormData({...formData, title: e.target.value});
                            setFieldErrors(prev => ({...prev, title: undefined}));
                        }}
                    />
                    {fieldErrors.title && <p id="itinerary-title-error" role="alert" className="mt-2 text-sm text-red-800">{fieldErrors.title}</p>}
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="min-w-0">
                        <label htmlFor="date" className="field-label">日付 <span className="text-xs font-normal text-muted">必須</span></label>
                        <input
                            id="date"
                            name="date"
                            type="date"
                            required
                            className="field"
                            min={prop.trip.startDate}
                            max={prop.trip.endDate}
                            value={formData.date}
                            aria-invalid={!!fieldErrors.date}
                            aria-describedby={`itinerary-date-hint${fieldErrors.date ? " itinerary-date-error" : ""}`}
                            onChange={e => {
                                setFormData({...formData, date: e.target.value});
                                setFieldErrors(prev => ({...prev, date: undefined}));
                            }}
                        />
                        <p id="itinerary-date-hint" className="mt-2 text-xs leading-5 text-muted">旅行期間内の日付を選択してください。</p>
                        {fieldErrors.date && <p id="itinerary-date-error" role="alert" className="mt-2 text-sm text-red-800">{fieldErrors.date}</p>}
                    </div>
                    <div className="min-w-0">
                        <label htmlFor="time" className="field-label">時刻 <span className="text-xs font-normal text-muted">任意</span></label>
                        <input
                            id="time"
                            name="time"
                            type="time"
                            className="field"
                            value={formData.time ?? ""}
                            aria-describedby="itinerary-time-hint"
                            onChange={e => setFormData({...formData, time: e.target.value || null})}
                        />
                        <p id="itinerary-time-hint" className="mt-2 text-xs leading-5 text-muted">空欄のまま保存すると「時刻未定」になります。</p>
                    </div>
                </div>
                <div>
                    <label htmlFor="category" className="field-label">カテゴリ</label>
                    <select
                        id="category"
                        name="category"
                        className="field"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value as ItineraryCategory})}
                    >
                        <option value="sightseeing">観光</option>
                        <option value="food">食事</option>
                        <option value="transport">移動</option>
                        <option value="hotel">宿泊</option>
                        <option value="other">その他</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="memo" className="field-label">メモ <span className="text-xs font-normal text-muted">任意</span></label>
                    <textarea
                        id="memo"
                        name="memo"
                        className="field resize-y leading-7"
                        rows={4}
                        placeholder="予約情報や持ち物、当日楽しみにしていることなど"
                        value={formData.memo}
                        onChange={e => setFormData({...formData, memo: e.target.value})}
                    />
                </div>
            </fieldset>
            <div className="mt-8 border-t border-line pt-6">
                {error && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">{error}</p>}
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                    <button type="button" disabled={isSaving} onClick={() => router.push(`/trips/${prop.trip.id}`)} className="button-secondary disabled:cursor-not-allowed disabled:opacity-60">
                        キャンセル
                    </button>
                    <button type="submit" disabled={isSaving} className="button-primary disabled:cursor-not-allowed disabled:opacity-60">
                        <Icon name={prop.mode === "create" ? "plus" : "check"} />
                        {isSaving ? "保存中…" : prop.mode === "create" ? "予定を追加する" : "変更を保存する"}
                    </button>
                </div>
                <p role="status" className="sr-only">{isSaving ? "予定を保存しています" : ""}</p>
            </div>
        </form>
    );
}
