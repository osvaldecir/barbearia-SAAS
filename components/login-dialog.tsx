"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MessageCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const LoginDialog = () => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-[#f7e257] bg-[#1f1f1f] px-3 text-sm font-medium text-[#f7e257] shadow-md shadow-black/30 transition hover:bg-[#f7e257]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257]"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5 shrink-0"
        >
          <path fill="#4285F4" d="M3 6.8V18a1 1 0 0 0 1 1h3V10L3 6.8Z" />
          <path fill="#34A853" d="M17 10v9h3a1 1 0 0 0 1-1V6.8L17 10Z" />
          <path
            fill="#EA4335"
            d="M3 6.8 12 13l9-6.2-2.1-1.6a2 2 0 0 0-2.4 0L12 9.1 7.5 5.2a2 2 0 0 0-2.4 0L3 6.8Z"
          />
          <path fill="#FBBC04" d="M3 6.8 7 10v9H4a1 1 0 0 1-1-1V6.8Z" />
        </svg>
        Fazer login
      </button>
      <DialogContent className="border border-[#f7e257]/30 bg-[#121212] text-white shadow-2xl shadow-black/50 ring-0">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-semibold text-[#f7e257]">
            Fazer login
          </DialogTitle>
          <DialogDescription className="leading-relaxed text-zinc-400">
            Conecte-se com sua conta Google.
          </DialogDescription>
        </DialogHeader>
        <div className="mx-auto flex w-full max-w-[278px] items-center justify-center rounded-xl border border-[#f7e257]/20 bg-[#080808] p-3">
          <Image
            src="/login.png"
            alt="Google"
            width={278}
            height={37}
            className="h-auto w-full"
          />
        </div>
        <Link
          href="https://wa.me/5517988126114"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#f7e257]/30 bg-[#f7e257]/10 px-4 py-3 text-sm font-medium text-[#f7e257] transition hover:border-[#f7e257]/60 hover:bg-[#f7e257]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257]"
        >
          <MessageCircle aria-hidden="true" className="h-4 w-4" />
          Chamar no zap
        </Link>
      </DialogContent>
    </Dialog>
  )
}

export default LoginDialog
