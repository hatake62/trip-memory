import type { Metadata } from "next";
import Link from "next/link";
import { TripForm } from "@/components/trips/TripForm";
import Icon from "@/components/ui/Icon";

export const metadata: Metadata = { title: "新しい旅行" };

export default function Page() {
  return (
    <main id="main-content" className="page-shell py-8 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="mb-8 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm text-muted hover:text-forest"><Icon name="arrow" className="size-4" />旅行一覧に戻る</Link>
        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-muted">A NEW JOURNEY</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">新しい旅行</h1>
        <p className="mb-8 mt-4 text-sm leading-7 text-muted">次は、どこへ行きますか。<br />旅の名前と行き先から、予定をかたちにしましょう。</p>
        <TripForm mode="create"/>
      </div>
    </main>
  );
}
