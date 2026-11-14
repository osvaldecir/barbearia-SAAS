"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

const BackButton = () => {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex items-center gap-3 rounded-lg border border-[#f7e257] px-5 py-3 text-lg font-semibold text-[#f7e257] transition hover:bg-[#f7e257]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257]"
    >
      <ArrowLeft aria-hidden="true" className="h-6 w-6" />
      Voltar
    </button>
  )
}

export default BackButton
