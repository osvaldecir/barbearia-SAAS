"use client"

import type { ReactNode } from "react"

type SidebarButtonProps = {
  icon: ReactNode
  label: string
  onClick: () => void
}

const SidebarButton = ({ icon, label, onClick }: SidebarButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257]"
    >
      <span aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </button>
  )
}

export default SidebarButton
