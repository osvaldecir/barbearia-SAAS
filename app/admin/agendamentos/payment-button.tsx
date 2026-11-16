"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { formatCurrency, toCents } from "@/app/lib/accounting"

type PaymentButtonProps = {
  bookingId: string
  paidAt: Date | null
  paidAmount: number | null
  paymentMethod: string | null
}

export default function PaymentButton({
  bookingId,
  paidAt,
  paidAmount,
  paymentMethod: recordedPaymentMethod,
}: PaymentButtonProps) {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("PIX")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  const savePayment = async () => {
    setIsSaving(true)
    setError("")

    try {
      const response = await fetch(
        `/api/admin/bookings/${bookingId}/payment`,
        paidAt
          ? { method: "DELETE" }
          : {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentMethod }),
            },
      )
      const result = (await response.json()) as { error?: string }
      if (!response.ok) {
        setError(result.error ?? "Não foi possível registrar o pagamento.")
        return
      }

      router.refresh()
    } catch {
      setError("Não foi possível registrar o pagamento. Tente novamente.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {!paidAt ? (
        <select
          aria-label="Forma de pagamento"
          value={paymentMethod}
          onChange={(event) => setPaymentMethod(event.target.value)}
          className="rounded-lg border border-white/10 bg-[#181818] px-2 py-2 text-xs text-white"
        >
          <option value="PIX">PIX</option>
          <option value="Dinheiro">Dinheiro</option>
          <option value="Cartão">Cartão</option>
        </select>
      ) : (
        <span className="text-xs text-emerald-300">
          Pago: {recordedPaymentMethod ?? "Forma não informada"} ·{" "}
          {paymentDateLabel(paidAt)} ·{" "}
          {formatCurrency(toCents(paidAmount ?? 0))}
        </span>
      )}
      <button
        type="button"
        onClick={savePayment}
        disabled={isSaving}
        className="rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-300 transition hover:bg-white/10 disabled:opacity-50"
      >
        {isSaving
          ? "Salvando..."
          : paidAt
            ? "Desfazer registro"
            : "Registrar pagamento"}
      </button>
      {error && (
        <span role="alert" className="w-full text-xs text-red-400">
          {error}
        </span>
      )}
    </div>
  )
}

function paymentDateLabel(paidAt: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(paidAt)
}
