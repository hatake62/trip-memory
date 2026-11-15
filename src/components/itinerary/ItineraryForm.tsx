"use client";

import { addItineraryItem } from "@/lib/itinerary-storage";
import type { CreateItineraryInput, ItineraryCategory, Trip } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";


type ItineraryFormProps = {
    trip: Trip;
};

export function ItineraryForm({trip}: ItineraryFormProps) {
    const [ formData, setFormData ] = useState<CreateItineraryInput>({
        tripId: trip.id,
        date: trip.startDate,
        time: null,
        title: "",
        category: "other",
        memo: ""
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

            if(formData.date < trip.startDate || formData.date > trip.endDate){
                setError("日付は旅行日内で指定してください");
                return;
            }
    
            const validatedData: CreateItineraryInput = {
                ...formData,
                title: formData.title.trim(),
            };

            try {
                addItineraryItem(validatedData);
                router.push(`/trips/${trip.id}`);
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
                    min={trip.startDate}
                    max={trip.endDate}
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
                    スケジュールを作成する
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