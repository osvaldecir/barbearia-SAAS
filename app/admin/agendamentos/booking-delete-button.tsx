"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

type BookingDeleteButtonProps = {
  bookingId: string
  hasPayment: boolean
}

export default function BookingDeleteButton({
  bookingId,
  hasPayment,
}: BookingDeleteButtonProps) {
  const router = useRouter()
  const [error, setError] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const deleteBooking = async () => {
    const confirmation = hasPayment
      ? "Excluir permanentemente este agendamento? O pagamento registrado também será removido do relatório financeiro."
      : "Excluir permanentemente este agendamento?"

    if (!window.confirm(confirmation)) return

    setIsDeleting(true)
    setError("")
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "DELETE",
      })
      const result = (await response.json()) as { error?: string }
      if (!response.ok) {
        setError(result.error ?? "Não foi possível excluir o agendamento.")
        return
      }

      router.refresh()
    } catch {
      setError("Não foi possível excluir o agendamento. Tente novamente.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={deleteBooking}
        disabled={isDeleting}
        className="rounded-lg border border-red-500/30 px-3 py-2 text-xs text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
      >
        {isDeleting ? "Excluindo..." : "Excluir agendamento"}
      </button>
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
