"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function NavLink({
  href,
  children,
  exact = false,
}: {
  href: string
  children: React.ReactNode
  exact?: boolean
}) {
  const pathname = usePathname()
  const active = exact ? pathname === href : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={cn(
        "block rounded-lg px-3.5 py-2 text-sm transition-colors",
        active
          ? "bg-orth-electric/15 text-white font-medium"
          : "text-orth-muted hover:text-white hover:bg-white/5"
      )}
    >
      {children}
    </Link>
  )
}
