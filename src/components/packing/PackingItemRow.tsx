'use client';

import { deletePackingItem } from "@/lib/packing-storage";
import type { PackingItem } from "@/lib/types";
import Link from "next/link";
import { useState } from "react";

type PackingItemRowProps = {
    item: PackingItem;
    canEdit: boolean;
    onToggle: (id: string) => void;
    onDeleted: (id: string) => void;
};

export function PackingItemRow({ item, canEdit, onToggle, onDeleted }: PackingItemRowProps) {
    const [deleteError, setDeleteError] = useState("");

    function handleDelete() {
        if (!canEdit) return;

        const confirmed = window.confirm(
            `「${item.name}」を削除しますか？この操作は取り消せません`
        );
        if (!confirmed) return;

        setDeleteError("");
        try {
            const result = deletePackingItem(item.id);
            if (!result) {
                setDeleteError("削除対象の持ち物が見つかりませんでした");
                return;
            }
            onDeleted(item.id);
        } catch (err) {
            console.error(err);
            setDeleteError("持ち物の削除に失敗しました。もう一度お試しください");
        }
    }

    return (
        <li className={`rounded-xl border border-line p-3 sm:p-4 ${item.isPacked ? "bg-sage/60" : "bg-white"}`}>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                <label className={`flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-lg px-1 ${canEdit ? "cursor-pointer" : "cursor-default"}`}>
                    <input
                        type="checkbox"
                        checked={item.isPacked}
                        disabled={!canEdit}
                        onChange={() => { if (canEdit) onToggle(item.id); }}
                        className="size-5 shrink-0 accent-forest enabled:cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span className="min-w-0">
                        <span className={`block break-words text-sm font-medium leading-6 ${item.isPacked ? "text-muted line-through" : "text-foreground"}`}>
                            {item.name}
                        </span>
                        <span aria-hidden="true" className="mt-0.5 block text-xs text-muted">
                            {item.isPacked ? "準備済み" : "未準備"}
                        </span>
                    </span>
                </label>
                {canEdit && (
                    <div className="flex shrink-0 items-center justify-end gap-1">
                        <Link
                            href={`/trips/${item.tripId}/packing/${item.id}/edit`}
                            aria-label={`${item.name}を編集`}
                            className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm text-forest underline-offset-4 hover:bg-sage hover:underline"
                        >
                            編集
                        </Link>
                        <button
                            type="button"
                            onClick={handleDelete}
                            aria-label={`${item.name}を削除`}
                            className="min-h-11 rounded-lg px-3 text-sm text-red-700 underline-offset-4 hover:bg-red-50 hover:underline"
                        >
                            削除
                        </button>
                    </div>
                )}
            </div>
            {deleteError && <p role="alert" className="mt-2 text-sm leading-6 text-red-800">{deleteError}</p>}
        </li>
    );
}
