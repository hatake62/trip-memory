import { PackingCreate } from "@/components/packing/PackingCreate";
import { Suspense } from "react";
import type { Metadata } from "next";
import { PackingFormStatus } from "@/components/packing/PackingFormLayout";

export const metadata: Metadata = { title: "持ち物を追加" };

type Props = {
    params: Promise<{id: string}>;
};

async function PackingCreateContent({ params }: Props) {
  const { id } = await params;

  return <PackingCreate id={id} />;
}

export default function Page({ params }: Props) {
    return (
        <main id="main-content" className="page-shell max-w-3xl py-8 sm:py-12">
            <Suspense fallback={<PackingFormStatus>ページを読み込んでいます...</PackingFormStatus>}>
                <PackingCreateContent params={params} />
            </Suspense>
        </main>
    )
}
