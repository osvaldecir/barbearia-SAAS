import { SearchIcon } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#040404] px-4 pb-8 pt-4 text-white">
      <div className="mx-auto max-w-[420px]">
        <div className="mb-4">
          <h1 className="text-[2rem] font-black italic leading-none tracking-[-0.04em] text-white">
            Olá, ClienteTester
          </h1>
          <p className="mt-1 text-sm text-zinc-400">Domingo, 04 de outubro de 2026</p>
        </div>

        <form className="mb-5 flex items-center gap-2 rounded-md border border-[#f7e257]/70 bg-[#0c0c0c] px-2 py-2 shadow-[inset_0_0_0_1px_rgba(247,226,87,0.08)]">
          <input
            type="search"
            aria-label="Buscar barbearias"
            placeholder="Favor faça sua busca..."
            className="w-full bg-transparent px-2 py-1 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#f7e257] text-black shadow-sm transition-opacity hover:opacity-90"
            aria-label="Buscar"
          >
            <SearchIcon className="h-4 w-4" />
          </button>
        </form>

        <div className="relative overflow-hidden rounded-[20px] border border-[#f7e257]/15 bg-black shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(247,226,87,0.18),_transparent_30%)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0b] via-[#1a1a1a]/40 to-transparent" />

          <Image
            src="/bannerP.png"
            alt="FSW Barber"
            width={800}
            height={480}
            className="h-[220px] w-full object-cover object-center opacity-85"
          />

          <div className="absolute inset-0 flex items-end justify-start p-4">
            <div className="max-w-[72%]">
              <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-200/80">
                excelência em
              </p>
              <h2 className="text-3xl font-black leading-[0.9] tracking-[-0.05em] text-white">
                Beleza
                <span className="block text-[#f7e257]">Masculina</span>
              </h2>
            </div>
          </div>
        </div>

        <section className="mt-6" aria-labelledby="booking-heading">
          <h2
            id="booking-heading"
            className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-white/90"
          >
            Agendamento
          </h2>

          <article className="rounded-xl border border-white/10 bg-[#111111] p-4 shadow-[0_8px_18px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-2">
              <Badge className="rounded-full bg-[#f7e257] px-3 py-1 text-[11px] font-semibold text-black hover:bg-[#f7e257]">
                Confirmado
              </Badge>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-white">Corte de Cabelo</h3>
                <p className="mt-1 text-sm text-zinc-400">Hoje · 16:00</p>
              </div>

              <Avatar className="h-10 w-10 border-2 border-[#f7e257]/60">
                <AvatarImage
                  src="/capa.png"
                  alt="FSW Barber"
                  className="h-full w-full rounded-full object-cover"
                />
                <AvatarFallback className="bg-[#f7e257] text-xs font-bold text-black">
                  FSW
                </AvatarFallback>
              </Avatar>
            </div>
          </article>
        </section>
      </div>
    </main>
  )
}
