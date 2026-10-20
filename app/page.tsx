import { CalendarDays, Clock3, SearchIcon } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import BarbershopItem from "@/_components/barbershop-item"
import { db } from "@/_lib/prisma"

export const dynamic = "force-dynamic"

export default async function Home() {
  const barberShops = await db.barbershop.findMany({
    where: {
      NOT: [
        ...[
          "Barba & Navalha",
          "Barbearia Elegance",
          "Barbearia Vintage",
          "Corte & Estilo Clássico",
          "Estilo Urbano",
          "Machado & Tesoura",
          "The Dapper Den",
        ].map((name) => ({
          name: {
            equals: name,
            mode: "insensitive" as const,
          },
        })),
        {
          name: {
            contains: "Cabelo & Cia",
            mode: "insensitive" as const,
          },
        },
        {
          AND: [
            {
              name: {
                contains: "Corte",
                mode: "insensitive" as const,
              },
            },
            {
              name: {
                contains: "Estilo",
                mode: "insensitive" as const,
              },
            },
          ],
        },
        {
          AND: [
            {
              name: {
                contains: "Estilo",
                mode: "insensitive" as const,
              },
            },
            {
              name: {
                contains: "Clássico",
                mode: "insensitive" as const,
              },
            },
          ],
        },
      ],
    },
    select: {
      id: true,
      name: true,
      address: true,
      description: true,
      imageUrl: true,
    },
    orderBy: { name: "asc" },
  })

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080808] px-4 pb-16 pt-8 text-white sm:px-6 lg:px-8 lg:pt-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_at_top,_rgba(247,226,87,0.09),_transparent_65%)]" />
      <div className="relative mx-auto max-w-6xl">
        <section className="mb-8 flex flex-col gap-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
           
            <h1 className="max-w-2xl font-[var(--font-geist-sans)] text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Olá, clienteTester
            </h1>
            
          </div>

          <form
            role="search"
            className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-[#121212] p-2 shadow-lg shadow-black/20 transition focus-within:border-[#f7e257]/50 sm:max-w-sm"
          >
            <SearchIcon
              aria-hidden="true"
              className="ml-2 h-4 w-4 shrink-0 text-zinc-500"
            />
            <input
              type="search"
              aria-label="Buscar barbearias"
              placeholder="Buscar barbearias..."
              className="h-10 min-w-0 flex-1 bg-transparent px-1 text-sm text-white outline-none placeholder:text-zinc-500"
            />
            <button
              type="submit"
              className="rounded-lg bg-[#f7e257] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#ffec70] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
            >
              Buscar
            </button>
          </form>
        </section>

        <div className="relative mb-8 min-h-[220px] overflow-hidden rounded-3xl border border-white/10 bg-[#121212] shadow-2xl shadow-black/40 sm:mb-10 sm:min-h-[280px]">
          <Image
            src="/bannerP.png"
            alt="Interior de uma barbearia FSW Barber"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1152px"
            className="object-cover object-center opacity-65"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-black/10" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
          <section aria-labelledby="booking-heading">
            <div className="mb-4">
              <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
                Sua próxima visita
              </p>
              <h2
                id="booking-heading"
                className="text-xl font-semibold tracking-tight text-white"
              >
                Agendamento
              </h2>
            </div>

            <article className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#191919] to-[#101010] shadow-xl shadow-black/20">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <span className="text-sm font-medium text-zinc-300">
                  Seu horário está reservado
                </span>
                <Badge className="h-auto rounded-full border border-[#f7e257]/20 bg-[#f7e257]/10 px-3 py-1 text-[11px] font-semibold text-[#f7e257] hover:bg-[#f7e257]/10">
                  Confirmado
                </Badge>
              </div>

              <div className="flex items-center gap-4 p-5">
                <div className="flex h-[72px] w-[72px] shrink-0 flex-col items-center justify-center rounded-xl border border-[#f7e257]/20 bg-[#f7e257]/10">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#f7e257]">
                    Out
                  </span>
                  <span className="text-2xl font-bold leading-tight text-white">
                    18
                  </span>
                  <span className="text-[10px] text-zinc-400">2026</span>
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-lg font-semibold text-white">
                    Corte de cabelo
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-400">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays
                        aria-hidden="true"
                        className="h-4 w-4 text-[#f7e257]"
                      />
                      18 de outubro
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3
                        aria-hidden="true"
                        className="h-4 w-4 text-[#f7e257]"
                      />
                      16:00
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </section>

          <section aria-labelledby="barbershops-heading">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                
                <h2
                  id="barbershops-heading"
                  className="text-xl font-semibold tracking-tight text-white"
                >
                  Barbearias
                </h2>
              </div>
              <span className="pb-0.5 text-sm text-zinc-500">
                {barberShops.length}{" "}
                {barberShops.length === 1 ? "local" : "locais"}
              </span>
            </div>

            {barberShops.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {barberShops.map((barbershop) => (
                  <BarbershopItem
                    key={barbershop.id}
                    barbershop={barbershop}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-10 text-center">
                <p className="font-medium text-zinc-200">
                  Nenhuma barbearia por aqui ainda
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  Volte em breve para encontrar seu novo lugar favorito.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
