"use client"

import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"

type WhatsappProfileFormProps = {
  returnTo: string
}

const WhatsappProfileForm = ({ returnTo }: WhatsappProfileFormProps) => {
  const router = useRouter()
  const [phone, setPhone] = useState("")
  const [whatsappReminderOptIn, setWhatsappReminderOptIn] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/profile/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, whatsappReminderOptIn }),
      })
      const result = (await response.json()) as { error?: string }

      if (!response.ok) {
        setError(result.error ?? "Não foi possível salvar seu celular.")
        return
      }

      router.replace(returnTo)
      router.refresh()
    } catch {
      setError("Não foi possível salvar seu celular. Verifique sua conexão.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-4 py-10 text-white">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-xl">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
          Quase lá
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Seu celular</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Informe seu WhatsApp para concluir o cadastro e fazer reservas.
        </p>

        <form onSubmit={saveProfile} className="mt-6 space-y-4">
          <label
            htmlFor="whatsapp-phone"
            className="block text-sm font-medium text-zinc-200"
          >
            Número de celular
          </label>
          <input
            id="whatsapp-phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="(11) 99999-9999"
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-3 text-sm text-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257]"
          />

          <label className="flex items-start gap-2 text-sm leading-5 text-zinc-300">
            <input
              type="checkbox"
              checked={whatsappReminderOptIn}
              onChange={(event) =>
                setWhatsappReminderOptIn(event.target.checked)
              }
              className="mt-1 accent-[#f7e257]"
            />
            <span>
              Autorizo receber pelo WhatsApp um lembrete no dia dos meus
              agendamentos. Posso continuar sem autorizar.
            </span>
          </label>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[#f7e257] px-5 py-3 font-bold text-black transition hover:bg-[#ffec70] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257] disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting ? "Salvando..." : "Continuar"}
          </button>
        </form>
      </section>
    </main>
  )
}

export default WhatsappProfileForm
