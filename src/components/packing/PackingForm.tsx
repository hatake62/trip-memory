'use client';

import { addPackingItem, updatePackingItem } from "@/lib/packing-storage";
import type { CreatePackingInput, PackingFormProps, UpdatePackingInput } from "@/lib/types";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";


export function PackingForm(prop: PackingFormProps) {
    const [ formData, setFormData ] = useState<CreatePackingInput>(
        prop.mode === "create" 
            ? {
                tripId: prop.trip.id,
                name: "",
                isPacked: false
            }
            : {
                tripId: prop.trip.id,
                name: prop.item.name,
                isPacked: prop.item.isPacked
            }
        );

    const [ error, setError ] = useState("");
    const router = useRouter();

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if(formData.name.trim() === "") {
            setError("持ち物名を入力してください");
            return;
        }

        const validatedData: CreatePackingInput = {
            ...formData,
            name: formData.name.trim()
        };

        try {
            if(prop.mode === "create"){
                addPackingItem(validatedData);
            } else {
                const updateInput: UpdatePackingInput = {
                    name: validatedData.name
                }

                const result = updatePackingItem(prop.item.id, updateInput);
                if(!result) {
                    setError("編集対象の持ち物が見つかりません ");
                    return;
                }
            }
            router.push(`/trips/${prop.trip.id}`);
        } catch(err) {
            console.error(err);
            setError("持ち物の保存に失敗しました");
        }
    }
    return (
        <form onSubmit={handleSubmit} >
            <label htmlFor="name">持ち物名</label>
            <input 
                id="name"
                type="text"
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
            />
            {error && <p role="alert">{error}</p>}
            <button type="submit">
                {prop.mode === "create" 
                    ? "持ち物を追加"
                    : "変更を保存"
                }
            </button>
        </form>

    )
}