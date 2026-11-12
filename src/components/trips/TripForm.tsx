'use client';

import type { CreateTripInput } from "@/lib/types";
import { useState } from "react";
import type { FormEvent } from "react";

export function TripForm() {
    const [ error, setError ] = useState("");
    const [ formData, setFormData ] = useState<CreateTripInput>({
        title: "",
        destination: "",
        startDate: "",
        endDate: "",
        memo: ""
    });

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if(formData.title.trim() === ""){
            setError("旅行名を入力してください");
            return;
        }

        if(formData.destination.trim() === ""){
            setError("目的地を入力してください");
            return;
        }

        if(formData.startDate === ""){
            setError("開始日を入力してください");
            return;
        }

        if(formData.endDate === ""){
            setError("終了日を入力してください");
            return;
        }

        if(formData.startDate > formData.endDate) {
            setError("終了日は開始日以降にしてください");
            return;
        }

        const validatedData: CreateTripInput = {
            ...formData,
            title: formData.title.trim(),
            destination: formData.destination.trim(),
        };

        setError("");
        console.log(validatedData);
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="title">旅行名</label>
            <input 
                id="title"
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                maxLength={60}
            />

            <label htmlFor="destination">目的地</label>
            <input 
                id="destination"
                type="text" 
                value={formData.destination} 
                onChange={e => setFormData({...formData, destination: e.target.value})} 
                maxLength={100}
            />

            <label htmlFor="startDate">開始日</label>
            <input 
                id="startDate"
                type="date" 
                value={formData.startDate} 
                onChange={e => setFormData({...formData, startDate: e.target.value})}
            />

            <label htmlFor="endDate">終了日</label>
            <input 
                id="endDate"
                type="date" 
                value={formData.endDate} 
                onChange={e => setFormData({...formData, endDate: e.target.value})}
            />

            <label htmlFor="memo">メモ</label>
            <textarea 
                id="memo"
                value={formData.memo} 
                onChange={e => setFormData({...formData, memo: e.target.value})} 
                maxLength={500}
            />
            {error && (
                <p role="alert" className="text-red-500">
                    {error}
                </p>
            )}
            <button type="submit">旅行を作成</button>
        </form>
    )
}