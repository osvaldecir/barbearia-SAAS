"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

type BookingActionProps = {
  bookingId: string
  isCancelled: boolean
}

const BookingCancelButton = ({
  bookingId,
  isCancelled,
}: BookingActionProps) => {
  const router = useRouter()
  const [isCancelling, setIsCancelling] = useState(false)
  const [error, setError] = useState("")

  const cancelBooking = async () => {
    if (
      isCancelling ||
      !window.confirm(
        isCancelled
          ? "Apagar este agendamento cancelado permanentemente?"
          : "Tem certeza que deseja cancelar este agendamento?",
      )
    ) {
      return
    }

    setIsCancelling(true)
    setError("")

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: isCancelled ? "DELETE" : "PATCH",
      })
      const result = (await response.json()) as { error?: string }

      if (!response.ok) {
        setError(result.error ?? "Não foi possível cancelar o agendamento.")
        return
      }

      router.refresh()
    } catch {
      setError("Não foi possível cancelar o agendamento. Tente novamente.")
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <div className="flex items-center justify-between gap-3">
      {!isCancelled ? (
        <button
          type="button"
          onClick={cancelBooking}
          disabled={isCancelling}
          className="text-xs text-zinc-500 underline decoration-zinc-700 underline-offset-2 transition hover:text-red-400 hover:decoration-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257] disabled:cursor-wait disabled:opacity-60"
        >
          {isCancelling ? "Cancelando..." : "Cancelar"}
        </button>
      ) : (
        <span aria-hidden="true" />
      )}
      {isCancelled && (
        <button
          type="button"
          onClick={cancelBooking}
          disabled={isCancelling}
          aria-label="Apagar agendamento cancelado"
          title="Apagar agendamento cancelado"
          className="rounded p-1 text-[#f7e257]/50 transition hover:bg-[#f7e257]/10 hover:text-[#f7e257] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257] disabled:cursor-wait disabled:opacity-60"
        >
          <Trash2 aria-hidden="true" className="h-4 w-4" />
        </button>
      )}
      {error && (
        <span role="alert" className="text-xs text-red-400">
          {error}
        </span>
      )}
    </div>
  )
}

export default BookingCancelButton
