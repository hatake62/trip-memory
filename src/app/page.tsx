import Link from "next/link";
import TripList from "@/components/trips/TripList";
import Icon from "@/components/ui/Icon";
import { Suspense } from "react";

export default function Home() {
  return (
    <main id="main-content" className="page-shell py-10 sm:py-16">
      <div className="mb-10 flex flex-col justify-between gap-6 sm:mb-12 sm:flex-row sm:items-end">
        <div>
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-muted">MY TRAVEL JOURNAL</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">旅行一覧</h1>
          <p className="mt-4 text-sm leading-7 text-muted sm:text-base">次の楽しみも、大切な思い出も。<br className="sm:hidden" />あなたの旅を、ここから。</p>
        </div>
        <Link href="/trips/new" className="button-primary shrink-0"><Icon name="plus" />新しい旅行を作成</Link>
      </div>
      {/* 日時に依存する既存のステータス判定を、静的シェルの外に保つ。 */}
      <Suspense fallback={<p role="status" className="rounded-2xl border border-line bg-white p-8 text-sm text-muted">旅行を読み込み中...</p>}>
        <TripList />
      </Suspense>
    </main>
  );
}
