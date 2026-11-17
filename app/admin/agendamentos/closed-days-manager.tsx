"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

type ClosedDay = {
  id: string
  date: string
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00.000Z`))

export default function ClosedDaysManager({
  initialDate,
  closedDays,
}: {
  initialDate: string
  closedDays: ClosedDay[]
}) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState("")

  const addClosedDay = async (formData: FormData) => {
    setIsSaving(true)
    setError("")

    try {
      const response = await fetch("/api/admin/closed-days", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: formData.get("date") }),
      })
      const result = (await response.json()) as { error?: string }
      if (!response.ok) {
        setError(result.error ?? "Não foi possível bloquear esse dia.")
        return
      }

      const form = document.getElementById("closed-day-form")
      if (form instanceof HTMLFormElement) form.reset()
      router.refresh()
    } catch {
      setError("Não foi possível bloquear esse dia. Tente novamente.")
    } finally {
      setIsSaving(false)
    }
  }

  const removeClosedDay = async (id: string) => {
    setDeletingId(id)
    setError("")

    try {
      const response = await fetch(`/api/admin/closed-days/${id}`, {
        method: "DELETE",
      })
      const result = (await response.json()) as { error?: string }
      if (!response.ok) {
        setError(result.error ?? "Não foi possível reabrir esse dia.")
        return
      }

      router.refresh()
    } catch {
      setError("Não foi possível reabrir esse dia. Tente novamente.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <form
        id="closed-day-form"
        action={addClosedDay}
        className="mt-4 flex flex-wrap items-end gap-3"
      >
        <label className="grid gap-1 text-xs text-zinc-400">
          Data que ficará fechada
          <input
            name="date"
            required
            type="date"
            min={initialDate}
            max="2050-12-31"
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
          />
        </label>
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-[#f7e257] px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
        >
          {isSaving ? "Salvando..." : "Bloquear dia"}
        </button>
      </form>

      {closedDays.length ? (
        <ul className="mt-4 divide-y divide-white/10">
          {closedDays.map(({ id, date }) => (
            <li
              key={id}
              className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"
            >
              <span className="text-zinc-300">{formatDate(date)}</span>
              <button
                type="button"
                onClick={() => removeClosedDay(id)}
                disabled={deletingId !== null}
                className="text-xs text-zinc-400 underline hover:text-[#f7e257] disabled:opacity-50"
              >
                {deletingId === id ? "Reabrindo..." : "Reabrir dia"}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-zinc-500">
          Nenhum dia fechado cadastrado.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-400">
          {error}
        </p>
      )}
    </>
  )
}
