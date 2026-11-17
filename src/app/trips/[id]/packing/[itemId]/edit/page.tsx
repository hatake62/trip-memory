import { PackingEdit } from "@/components/packing/PackingEdit";
import { Suspense } from "react";

type Props = {
    params: Promise<{id: string, itemId: string}>;
};

async function PackingEditContent({ params }: Props) {
  const { id, itemId } = await params;

  return <PackingEdit tripId={id} itemId={itemId} />;
}

export default function Page({ params }: Props) {
    return (
        <main>
            <Suspense fallback={<p>ページを取得しています</p>}>
                <PackingEditContent params={params} />
            </Suspense>
        </main>
    )
}