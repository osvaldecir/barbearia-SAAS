"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ExpenseForm({ month }: { month: string }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  const addExpense = async (formData: FormData) => {
    setIsSaving(true)
    setError("")

    try {
      const response = await fetch("/api/admin/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: formData.get("description"),
          amount: Number(formData.get("amount")),
          date: formData.get("date"),
          month: formData.get("month"),
        }),
      })
      const result = (await response.json()) as { error?: string }
      if (!response.ok) {
        setError(result.error ?? "Não foi possível registrar a despesa.")
        return
      }

      const form = document.getElementById("expense-form")
      if (form instanceof HTMLFormElement) form.reset()
      router.refresh()
    } catch {
      setError("Não foi possível registrar a despesa. Tente novamente.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form
      id="expense-form"
      action={addExpense}
      className="mt-4 grid gap-3 sm:grid-cols-[1fr_180px_auto]"
    >
      <label className="sr-only" htmlFor="expense-description">
        Descrição da despesa
      </label>
      <input
        id="expense-description"
        name="description"
        required
        maxLength={120}
        placeholder="Ex.: produtos, aluguel, energia"
        className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-zinc-500"
      />
      <label className="sr-only" htmlFor="expense-amount">
        Valor da despesa
      </label>
      <input
        id="expense-amount"
        name="amount"
        required
        type="number"
        min="0.01"
        max="99999999"
        step="0.01"
        placeholder="Valor em R$"
        className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-zinc-500"
      />
      <label className="grid gap-1 text-xs text-zinc-400 sm:col-span-2">
        Data da despesa
        <input
          name="date"
          required
          type="date"
          defaultValue={`${month}-01`}
          min={`${month}-01`}
          max={`${month}-${new Date(
            Number(month.slice(0, 4)),
            Number(month.slice(5, 7)),
            0,
          )
            .getDate()
            .toString()
            .padStart(2, "0")}`}
          className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
        />
      </label>
      <input type="hidden" name="month" value={month} />
      <button
        type="submit"
        disabled={isSaving}
        className="rounded-lg bg-[#f7e257] px-4 py-2 text-sm font-semibold text-black disabled:opacity-50 sm:col-span-3"
      >
        {isSaving ? "Salvando..." : "Adicionar despesa"}
      </button>
      {error && (
        <p role="alert" className="text-sm text-red-400 sm:col-span-3">
          {error}
        </p>
      )}
    </form>
  )
}
