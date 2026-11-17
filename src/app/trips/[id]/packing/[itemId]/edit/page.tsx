import { PackingEdit } from "@/components/packing/PackingEdit";
import { Suspense } from "react";
import type { Metadata } from "next";
import { PackingFormStatus } from "@/components/packing/PackingFormLayout";

export const metadata: Metadata = { title: "持ち物を編集" };

type Props = {
    params: Promise<{id: string, itemId: string}>;
};

async function PackingEditContent({ params }: Props) {
  const { id, itemId } = await params;

  return <PackingEdit tripId={id} itemId={itemId} />;
}

export default function Page({ params }: Props) {
    return (
        <main id="main-content" className="page-shell max-w-3xl py-8 sm:py-12">
            <Suspense fallback={<PackingFormStatus>ページを読み込んでいます...</PackingFormStatus>}>
                <PackingEditContent params={params} />
            </Suspense>
        </main>
    )
}
