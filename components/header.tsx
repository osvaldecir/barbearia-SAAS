import { CalendarDays } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { db } from "@/_lib/prisma"
import LoginDialog from "@/components/login-dialog"

const Header = async () => {
  const barbershop = await db.barbershop.findFirst({
    where: {
      name: {
        equals: "shinider",
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      barbershopServices: {
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: "asc" },
      },
    },
  })
  const visibleServices =
    barbershop?.barbershopServices.filter(
      (service) => service.name.trim().toLowerCase() !== "shinider",
    ) ?? []

  return (
    <header className="relative z-10 border-b border-white/10 bg-[#080808]/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Image
            src="/capa.png"
            alt="FSW Barber"
            width={400}
            height={150}
            priority
            className="h-auto w-[150px] sm:w-[170px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="#booking-heading"
            className="inline-flex items-center gap-2 rounded-full border border-[#f7e257]/30 bg-[#f7e257]/10 px-4 py-2 text-sm font-medium text-[#f7e257] transition hover:border-[#f7e257]/60 hover:bg-[#f7e257]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]"
          >
            <CalendarDays aria-hidden="true" className="h-4 w-4" />
            <span className="hidden sm:inline">Meus agendamentos</span>
            <span className="sm:hidden">Agendamentos</span>
          </Link>
          <LoginDialog />
          <details className="group relative">
            <summary
              aria-label="Abrir menu de serviços"
              className="flex h-10 w-10 list-none cursor-pointer items-center justify-center rounded-lg transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257] [&::-webkit-details-marker]:hidden"
            >
              <Image
                src="/burgue.png"
                alt=""
                aria-hidden="true"
                width={32}
                height={32}
                className="h-8 w-8"
              />
            </summary>
            <nav
              aria-label="Menu de serviços"
              className="absolute right-0 top-full z-20 mt-2 flex max-h-[min(70vh,32rem)] min-w-56 flex-col gap-1 overflow-y-auto rounded-xl border border-white/10 bg-[#121212] p-2 shadow-xl"
            >
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Serviços
              </p>
              {barbershop && visibleServices.length ? (
                visibleServices.map((service) => (
                  <Link
                    key={service.id}
                    href={`/barbershops/${barbershop.id}?serviceId=${service.id}`}
                    aria-label={`Agendar ${service.name}`}
                    className="rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-[#f7e257]"
                  >
                    {service.name}
                  </Link>
                ))
              ) : (
                <p className="px-3 py-2 text-sm text-zinc-500">
                  Nenhum serviço disponível.
                </p>
              )}
              <Link
                href="#barbershops-heading"
                className="rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-[#f7e257]"
              >
                Barbearias
              </Link>
              <Link
                href="#booking-heading"
                className="rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-[#f7e257]"
              >
                Meus agendamentos
              </Link>
              {barbershop && (
                <Link
                  href={`/barbershops/${barbershop.id}`}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-[#f7e257] transition hover:bg-white/5"
                >
                  Ver todos e agendar
                </Link>
              )}
            </nav>
          </details>
        </div>
      </div>
      
    </header>
  )
}

export default Header
