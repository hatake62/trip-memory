import type { SVGProps } from "react";

const paths = {
  book: "M12 5C8 2 4 3 2 4v15c3-2 7-1 10 1m0-15c4-3 8-2 10-1v15c-3-2-7-1-10 1V5Z",
  plus: "M12 5v14M5 12h14",
  pin: "M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  calendar: "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
  arrow: "m12 5-7 7 7 7M5 12h14",
  check: "m5 12 4 4L19 6",
  camera: "M14 4h-4L8 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4l-2-3ZM16 14a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  utensils: "M4 3v5a3 3 0 0 0 6 0V3M7 3v18M18 3c-3 3-4 7-4 10h5M19 3v18",
  train: "M6 3h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM4 11h16M12 3v8M8 15h.01M16 15h.01M8 19l-3 3m11-3 3 3",
  bed: "M3 4v17m18-10v10M3 17h18M3 8h6v9M9 11h10a2 2 0 0 1 2 2v4",
} as const;

export default function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: keyof typeof paths }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d={paths[name]} />
    </svg>
  );
}
