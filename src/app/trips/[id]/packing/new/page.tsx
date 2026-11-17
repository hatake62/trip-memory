import { PackingCreate } from "@/components/packing/PackingCreate";
import { Suspense } from "react";

type Props = {
    params: Promise<{id: string}>;
};

async function PackingCreateContent({ params }: Props) {
  const { id } = await params;

  return <PackingCreate id={id} />;
}

export default function Page({ params }: Props) {
    return (
        <main>
            <Suspense fallback={<p>ページを取得しています</p>}>
                <PackingCreateContent params={params} />
            </Suspense>
        </main>
    )
}