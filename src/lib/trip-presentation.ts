import type { FilterStatus, TripStatus } from "./types";

// 表示用の文言・配色。ステータスの判定は trip-utils に任せる。
export const statusLabels: Record<FilterStatus, string> = {
  all: "すべて",
  past: "過去の旅行",
  ongoing: "旅行中",
  upcoming: "これから",
};

export const statusStyles: Record<TripStatus, string> = {
  past: "bg-[#f1f0eb] text-[#626456]",
  ongoing: "bg-[#e6f0e8] text-[#2e6244]",
  upcoming: "bg-[#f8eddb] text-[#795822]",
};
