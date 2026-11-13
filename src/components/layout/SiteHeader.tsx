import Link from "next/link";
import Icon from "@/components/ui/Icon";

export default function SiteHeader() {
  return (
    <header className="border-b border-line bg-white">
      <div className="page-shell flex min-h-20 items-center justify-between gap-4">
        <Link href="/" aria-label="TabiLog ホーム" className="flex items-center gap-3 rounded-lg">
          <span className="flex size-10 items-center justify-center rounded-xl bg-forest text-white"><Icon name="book" /></span>
          <span className="text-2xl font-semibold tracking-tight">TabiLog<span className="ml-1 text-forest">.</span></span>
        </Link>
        <p className="text-xs tracking-wider text-muted sm:text-sm">旅を、ひとつずつ。</p>
      </div>
    </header>
  );
}
