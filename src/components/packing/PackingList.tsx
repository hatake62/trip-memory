'use client';

import Icon from "@/components/ui/Icon";
import { getPackingItems, togglePackingItem } from "@/lib/packing-storage";
import type { PackingItem } from "@/lib/types";
import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";
import { PackingItemRow } from "./PackingItemRow";

type PackingListProps = {
    tripId: string;
    canEdit: boolean;
};

export function PackingList({ tripId, canEdit }: PackingListProps) {
    const headingId = useId();
    const progressId = useId();
    const [items, setItems] = useState<PackingItem[]>();
    const [loadError, setLoadError] = useState("");
    const [updateError, setUpdateError] = useState("");

    const loadItems = useCallback(() => {
        try {
            setItems(getPackingItems(tripId));
            setLoadError("");
            setUpdateError("");
        } catch (err) {
            console.error(err);
            setLoadError("持ち物の読み込みに失敗しました。もう一度お試しください");
        }
    }, [tripId]);

    useEffect(() => {
        // Activityで旅行詳細が再表示された際も、保存済みの内容を読み直す。
        const timerId = setTimeout(loadItems, 0);
        return () => window.clearTimeout(timerId);
    }, [loadItems]);

    function handleToggle(id: string) {
        if (!canEdit) return;

        setUpdateError("");
        try {
            const result = togglePackingItem(id);
            if (!result) {
                setUpdateError("更新対象の持ち物が見つかりませんでした");
                return;
            }
            setItems(prev => prev?.map(item => item.id === id ? result : item));
        } catch (err) {
            console.error(err);
            setUpdateError("持ち物の更新に失敗しました。もう一度お試しください");
        }
    }

    const packedCount = items?.filter(item => item.isPacked).length ?? 0;
    const totalCount = items?.length ?? 0;

    return (
        <section aria-labelledby={headingId} className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-sm sm:mt-8 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h2 id={headingId} className="text-xl font-bold">持ち物リスト</h2>
                {!canEdit && <span className="rounded-full bg-sage px-3 py-1 text-xs text-muted">閲覧専用</span>}
            </div>
            {items !== undefined && (
                <div className="mb-6">
                    <p id={progressId} role="status" aria-atomic="true" className="mb-3 text-sm text-muted">
                        準備済み <span className="font-semibold text-forest">{packedCount} / {totalCount}件</span>
                        {totalCount > 0 && packedCount === totalCount && <span className="ml-3">準備完了！</span>}
                    </p>
                    <progress
                        value={packedCount}
                        max={Math.max(totalCount, 1)}
                        aria-labelledby={progressId}
                        className="block h-2 w-full overflow-hidden rounded-full bg-sage accent-forest [&::-moz-progress-bar]:bg-forest [&::-webkit-progress-bar]:bg-sage [&::-webkit-progress-value]:bg-forest"
                    />
                </div>
            )}
            {loadError && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <p role="alert" className="text-sm leading-6 text-red-800">{loadError}</p>
                    <button type="button" onClick={loadItems} className="mt-2 min-h-11 rounded-lg px-2 text-sm font-medium text-forest underline underline-offset-4">
                        再読み込み
                    </button>
                </div>
            )}
            {updateError && (
                <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">{updateError}</p>
            )}
            {items === undefined ? (
                !loadError && <p role="status" className="py-8 text-center text-sm text-muted">持ち物を読み込んでいます...</p>
            ) : totalCount === 0 ? (
                <div role="status" className="rounded-xl bg-sage/60 px-4 py-8 text-center">
                    <p className="text-sm font-medium">まだ持ち物が登録されていません</p>
                    {canEdit && <p className="mt-2 text-sm leading-6 text-muted">旅に必要なものを追加して、準備を始めましょう。</p>}
                </div>
            ) : (
                <ul className="space-y-3">
                    {items.map(item => (
                        <PackingItemRow
                            key={item.id}
                            item={item}
                            canEdit={canEdit}
                            onToggle={handleToggle}
                            onDeleted={deletedId => {
                                setItems(prev => prev?.filter(item => item.id !== deletedId));
                                setUpdateError("");
                            }}
                        />
                    ))}
                </ul>
            )}
            {canEdit && (
                <div className="mt-6">
                    <Link href={`/trips/${tripId}/packing/new`} className="button-secondary w-full sm:w-auto">
                        <Icon name="plus" />
                        持ち物を追加
                    </Link>
                </div>
            )}
        </section>
    );
}
