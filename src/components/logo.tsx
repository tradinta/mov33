import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-accent"
        aria-hidden="true"
      >
        <path
          d="M4 5L8 5L11 19L7 19L4 5Z"
          fill="currentColor"
          fillOpacity="0.7"
        />
        <path d="M10 5L14 5L17 19L13 19L10 5Z" fill="currentColor" />
        <path
          d="M16 5L20 5L23 19L19 19L16 5Z"
          fill="currentColor"
          fillOpacity="0.7"
        />
      </svg>
      <span className="font-headline text-xl font-extrabold tracking-tight text-foreground">
        Mov33
      </span>
    </Link>
  );
}
