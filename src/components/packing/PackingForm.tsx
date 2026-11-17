'use client';

import Icon from "@/components/ui/Icon";
import { addPackingItem, getPackingItems, updatePackingItem } from "@/lib/packing-storage";
import { getSavedTrips } from "@/lib/trip-storage";
import type { PackingFormProps } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useId, useLayoutEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

export function PackingForm(prop: PackingFormProps) {
    const nameId = useId();
    const hintId = useId();
    const errorId = useId();
    const [name, setName] = useState(prop.mode === "create" ? "" : prop.item.name);
    const [nameError, setNameError] = useState("");
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const savingRef = useRef(false);
    const nameRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const isCreate = prop.mode === "create";

    // Activityが保存後のフォームを保持しても、次回は再び入力できるようにする。
    useLayoutEffect(() => {
        return () => {
            if (savingRef.current) {
                savingRef.current = false;
                setIsSaving(false);
                if (isCreate) setName("");
            }
        };
    }, [isCreate]);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (savingRef.current) return;

        setError("");
        setNameError("");
        const trimmedName = name.trim();
        if (!trimmedName) {
            setNameError("持ち物名を入力してください");
            nameRef.current?.focus();
            return;
        }

        savingRef.current = true;
        setIsSaving(true);
        try {
            // 表示後に旅行が削除された場合も、閲覧専用・存在しない旅行には保存しない。
            if (!getSavedTrips().some(trip => trip.id === prop.trip.id)) {
                throw new Error("この旅行の持ち物は変更できません");
            }
            if (prop.mode === "create") {
                addPackingItem({ tripId: prop.trip.id, name: trimmedName, isPacked: false });
            } else {
                const belongsToTrip = getPackingItems(prop.trip.id).some(item => item.id === prop.item.id);
                if (!belongsToTrip || !updatePackingItem(prop.item.id, { name: trimmedName })) {
                    setError("編集対象の持ち物が見つかりませんでした。旅行詳細から確認してください");
                    savingRef.current = false;
                    setIsSaving(false);
                    return;
                }
            }
            router.push(`/trips/${prop.trip.id}`);
        } catch (err) {
            console.error(err);
            setError("持ち物の保存に失敗しました。入力内容を確認して、もう一度お試しください");
            savingRef.current = false;
            setIsSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate aria-busy={isSaving} className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-8 border-b border-line pb-6">
                <h2 className="text-lg font-semibold">持ち物の基本情報</h2>
                <p id={hintId} className="mt-2 text-sm leading-6 text-muted">
                    {isCreate ? "旅に必要なものを1つずつ登録しましょう。準備状況は持ち物リストでチェックできます。" : "持ち物名を変更できます。準備状況はそのまま引き継がれます。"}
                </p>
            </div>
            <fieldset disabled={isSaving} className="min-w-0 disabled:opacity-70">
                <legend className="sr-only">持ち物の入力項目</legend>
                <label htmlFor={nameId} className="field-label">持ち物名 <span className="text-xs font-normal text-muted">必須</span></label>
                <input
                    ref={nameRef}
                    id={nameId}
                    name="name"
                    type="text"
                    required
                    className="field"
                    placeholder="例：パスポート、充電器"
                    aria-invalid={!!nameError}
                    aria-describedby={`${hintId}${nameError ? ` ${errorId}` : ""}`}
                    value={name}
                    onChange={event => {
                        setName(event.target.value);
                        setNameError("");
                    }}
                />
                {nameError && <p id={errorId} role="alert" className="mt-2 text-sm text-red-800">{nameError}</p>}
            </fieldset>
            <div className="mt-8 border-t border-line pt-6">
                {error && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">{error}</p>}
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                    <button type="button" disabled={isSaving} onClick={() => router.push(`/trips/${prop.trip.id}`)} className="button-secondary disabled:cursor-not-allowed disabled:opacity-60">
                        キャンセル
                    </button>
                    <button type="submit" disabled={isSaving} className="button-primary disabled:cursor-not-allowed disabled:opacity-60">
                        <Icon name={isCreate ? "plus" : "check"} />
                        {isSaving ? "保存中…" : isCreate ? "持ち物を追加" : "変更を保存"}
                    </button>
                </div>
                <p role="status" className="sr-only">{isSaving ? "持ち物を保存しています" : ""}</p>
            </div>
        </form>
    );
}
