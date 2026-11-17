'use client';

import { addPackingItem } from "@/lib/packing-storage";
import type { CreatePackingInput, Trip } from "@/lib/types";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type PackingFormProps = {
  trip: Trip;
};

export function PackingForm({ trip }: PackingFormProps) {
    const [ formData, setFormData ] = useState<CreatePackingInput>({
        tripId: trip.id,
        name: "",
        isPacked: false
    });

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
            addPackingItem(validatedData);
            router.push(`/trips/${trip.id}`);
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
                追加
            </button>
        </form>

    )
}