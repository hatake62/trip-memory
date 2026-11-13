import { getTripStatus } from "@/lib/trip-utils";
import { statusLabels, statusStyles } from "@/lib/trip-presentation";
import type { Trip } from "@/lib/types";
import Icon from "@/components/ui/Icon";

type TripCardProps = { trip: Trip };

export default function TripCard({ trip }: TripCardProps) {
  const status = getTripStatus(trip);

  return (
    <article className="flex h-full min-w-0 flex-col rounded-2xl border border-line bg-white p-6 sm:p-7">
      <div className="mb-7 flex items-center justify-between gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-sage text-forest"><Icon name="book" /></span>
        <span className={`rounded-full px-3 py-1.5 text-xs font-medium ${statusStyles[status]}`}>{statusLabels[status]}</span>
      </div>
      <h2 className="break-words text-xl font-semibold leading-snug tracking-tight">{trip.title}</h2>
      <p className="mb-7 mt-3 flex items-start gap-2 text-sm text-muted"><Icon name="pin" className="size-4 shrink-0" /><span className="break-words"><span className="sr-only">行き先：</span>{trip.destination}</span></p>
      <div className="mt-auto border-t border-line pt-5">
        <p className="mb-2 text-xs text-muted">旅行期間</p>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium tabular-nums">
          <Icon name="calendar" className="mr-1 size-4 text-muted" />
          <time dateTime={trip.startDate}>{trip.startDate.replaceAll("-", ".")}</time>
          <span className="text-muted">–</span>
          <time dateTime={trip.endDate}>{trip.endDate.replaceAll("-", ".")}</time>
        </p>
      </div>
    </article>
  );
}
