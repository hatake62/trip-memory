'use client';

import Link from "next/link";
import Icon from "@/components/ui/Icon";

import type { CreateTripInput } from "@/lib/types";
import { useState } from "react";
import type { FormEvent } from "react";

export function TripForm() {
    const [ error, setError ] = useState("");
    const [isValidated, setIsValidated] = useState(false);
    const [ formData, setFormData ] = useState<CreateTripInput>({
        title: "",
        destination: "",
        startDate: "",
        endDate: "",
        memo: ""
    });

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsValidated(false);
        if(formData.title.trim() === ""){
            setError("旅行名を入力してください");
            return;
        }

        if(formData.destination.trim() === ""){
            setError("目的地を入力してください");
            return;
        }

        if(formData.startDate === ""){
            setError("開始日を入力してください");
            return;
        }

        if(formData.endDate === ""){
            setError("終了日を入力してください");
            return;
        }

        if(formData.startDate > formData.endDate) {
            setError("終了日は開始日以降にしてください");
            return;
        }

        const validatedData: CreateTripInput = {
            ...formData,
            title: formData.title.trim(),
            destination: formData.destination.trim(),
        };

        setError("");
        console.log(validatedData);
        setIsValidated(true);
    }


    return (
        <form onSubmit={handleSubmit} onChange={() => setIsValidated(false)} className="rounded-2xl border border-line bg-white p-5 sm:p-8">
            <div className="mb-8 border-b border-line pb-6">
                <h2 className="text-lg font-semibold">旅の基本情報</h2>
                <p className="mt-2 text-sm leading-6 text-muted">必須の項目を入力してください。メモは後から考えても大丈夫です。</p>
            </div>
            <div className="space-y-6">
                <div>
                    <label htmlFor="title" className="field-label">旅行名 <span className="text-xs font-normal text-muted">必須</span></label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        className="field"
                        placeholder="例：京都で過ごす、冬の週末"
                        aria-required="true"
                        aria-invalid={error === "旅行名を入力してください"}
                        aria-describedby={error === "旅行名を入力してください" ? "trip-form-error" : undefined}
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        maxLength={60}
                    />
                    <p className="mt-2 text-xs text-muted">旅のテーマや、一緒に行く人の名前を入れても。60文字まで。</p>
                </div>
                <div>
                    <label htmlFor="destination" className="field-label">行き先 <span className="text-xs font-normal text-muted">必須</span></label>
                    <input
                        id="destination"
                        name="destination"
                        type="text"
                        className="field"
                        placeholder="例：京都府 京都市"
                        aria-required="true"
                        aria-invalid={error === "目的地を入力してください"}
                        aria-describedby={error === "目的地を入力してください" ? "trip-form-error" : undefined}
                        value={formData.destination}
                        onChange={e => setFormData({...formData, destination: e.target.value})}
                        maxLength={100}
                    />
                </div>
                <fieldset className="min-w-0">
                    <legend className="mb-3 text-sm font-semibold">旅行期間</legend>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="min-w-0">
                            <label htmlFor="startDate" className="field-label">開始日 <span className="text-xs font-normal text-muted">必須</span></label>
                            <input
                                id="startDate"
                                name="startDate"
                                type="date"
                                className="field"
                                aria-required="true"
                                aria-invalid={error === "開始日を入力してください"}
                                aria-describedby={error === "開始日を入力してください" ? "trip-form-error" : undefined}
                                value={formData.startDate}
                                onChange={e => setFormData({...formData, startDate: e.target.value})}
                            />
                        </div>
                        <div className="min-w-0">
                            <label htmlFor="endDate" className="field-label">終了日 <span className="text-xs font-normal text-muted">必須</span></label>
                            <input
                                id="endDate"
                                name="endDate"
                                type="date"
                                className="field"
                                aria-required="true"
                                aria-invalid={error === "終了日を入力してください" || error === "終了日は開始日以降にしてください"}
                                aria-describedby={error === "終了日を入力してください" || error === "終了日は開始日以降にしてください" ? "trip-form-error" : undefined}
                                value={formData.endDate}
                                onChange={e => setFormData({...formData, endDate: e.target.value})}
                            />
                        </div>
                    </div>
                </fieldset>
                <div>
                    <div className="flex items-baseline justify-between gap-3">
                        <label htmlFor="memo" className="field-label">メモ <span className="text-xs font-normal text-muted">任意</span></label>
                        <span className="text-xs tabular-nums text-muted">{formData.memo.length} / 500</span>
                    </div>
                    <textarea
                        id="memo"
                        name="memo"
                        className="field resize-y leading-7"
                        rows={4}
                        placeholder="行ってみたい場所、食べたいもの、旅で楽しみにしていること…"
                        value={formData.memo}
                        onChange={e => setFormData({...formData, memo: e.target.value})}
                        maxLength={500}
                    />
                </div>
            </div>
            <div className="mt-8 border-t border-line pt-6">
                <p className="mb-5 rounded-xl bg-sage px-4 py-3 text-xs leading-6 text-muted">現在は入力内容の確認まで利用できます。旅行の保存機能は準備中のため、入力内容は保存されません。</p>
                {error && (
                    <p id="trip-form-error" role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">
                        {error}
                    </p>
                )}
                {isValidated && (
                    <p role="status" className="mb-5 flex items-start gap-2 rounded-xl border border-line bg-sage px-4 py-3 text-sm leading-6 text-forest">
                        <Icon name="check" className="mt-0.5 shrink-0" />
                        入力内容を確認しました。旅行はまだ保存されていません。
                    </p>
                )}
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                    <Link href="/" className="button-secondary">旅行一覧に戻る</Link>
                    <button type="submit" className="button-primary"><Icon name="check" />入力内容を確認する</button>
                </div>
            </div>
        </form>
    )
}
