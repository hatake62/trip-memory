"use client";

import { addItineraryItem, updateItineraryItem } from "@/lib/itinerary-storage";
import type { CreateItineraryInput, ItineraryCategory, ItineraryFormProps, UpdateItineraryInput } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";


export function ItineraryForm(prop: ItineraryFormProps) {
    const [ formData, setFormData ] = useState<CreateItineraryInput>(
        prop.mode === "create" ? {
            tripId: prop.trip.id,
            date: prop.trip.startDate,
            time: null,
            title: "",
            category: "other",
            memo: ""
        }: {
            tripId: prop.trip.id,
            date: prop.item.date,
            time: prop.item.time,
            title: prop.item.title,
            category: prop.item.category,
            memo: prop.item.memo
    });

    const [ error, setError ] = useState("");

    const router = useRouter();

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
            event.preventDefault();
            if(formData.title.trim() === ""){
                setError("予定名を入力してください");
                return;
            }
    
            if(formData.date === ""){
                setError("日付を入力してください");
                return;
            }

            if(formData.date < prop.trip.startDate || formData.date > prop.trip.endDate){
                setError("日付は旅行日内で指定してください");
                return;
            }
    
            const validatedData: CreateItineraryInput = {
                ...formData,
                title: formData.title.trim(),
            };

            try {
                if(prop.mode === "create") {
                    addItineraryItem(validatedData);
                    router.push(`/trips/${prop.trip.id}`);
                } else {
                    const updateInput: UpdateItineraryInput = {
                        date: validatedData.date,
                        time: validatedData.time,
                        title: validatedData.title,
                        category: validatedData.category,
                        memo: validatedData.memo
                    };

                    const result = updateItineraryItem(prop.item.id, updateInput);
                    if(!result) {
                        setError("編集対象のスケジュールが見つかりません");
                        return;
                    }
                    router.push(`/trips/${prop.trip.id}`);
                }
            } catch(err) {
                console.error(err);
                setError("スケジュールの保存に失敗しました。もう一度お試しください");
            }
        }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">予定名</label>
                <input 
                    id="title"
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                />
                <label htmlFor="date">日付</label>
                <input 
                    id="date"
                    min={prop.trip.startDate}
                    max={prop.trip.endDate}
                    value={formData.date}
                    type="date" 
                    onChange={e => setFormData({...formData, date: e.target.value})}
                />
                <label htmlFor="time">時間</label>
                <input 
                    id="time"
                    value={formData.time ?? ""} 
                    type="time"
                    onChange={e => setFormData({...formData, time: e.target.value || null})}
                />
                <label htmlFor="category">カテゴリ</label>
                <select 
                    id="category"
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value as ItineraryCategory})}
                >
                    <option value="sightseeing">観光</option>
                    <option value="food">食事</option>
                    <option value="transport">移動</option>
                    <option value="hotel">ホテル</option>
                    <option value="other">その他</option>
                </select>
                <label htmlFor="memo">メモ</label>
                <textarea
                    id="memo"
                    value={formData.memo}
                    onChange={e => setFormData({...formData, memo: e.target.value})}
                />
                <button type="submit">
                    {prop.mode === "create" 
                        ? "スケジュールを作成する"
                        : "変更を保存する"}
                </button>
            </form>
            {error && (
                <p role="alert" className="text-red-500">
                    {error}
                </p>
            )}
        </div>
    )
    
}