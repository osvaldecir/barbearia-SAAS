"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ExpenseDeleteButton({
  expenseId,
}: {
  expenseId: string
}) {
  const router = useRouter()
  const [error, setError] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const deleteExpense = async () => {
    if (!window.confirm("Excluir este lançamento de despesa?")) return

    setIsDeleting(true)
    setError("")
    try {
      const response = await fetch(`/api/admin/expenses/${expenseId}`, {
        method: "DELETE",
      })
      const result = (await response.json()) as { error?: string }
      if (!response.ok) {
        setError(result.error ?? "Não foi possível excluir a despesa.")
        return
      }
      router.refresh()
    } catch {
      setError("Não foi possível excluir a despesa. Tente novamente.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="text-right">
      <button
        type="button"
        onClick={deleteExpense}
        disabled={isDeleting}
        className="text-xs text-zinc-500 underline hover:text-red-400 disabled:opacity-50"
      >
        {isDeleting ? "Excluindo..." : "Excluir"}
      </button>
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
