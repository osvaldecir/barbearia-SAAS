import { CalendarDays, Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const Header = () => {
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
          <details className="group relative">
            <summary
              aria-label="Abrir menu"
              className="flex h-10 w-10 list-none cursor-pointer items-center justify-center text-[#f7e257] [&::-webkit-details-marker]:hidden"
            >
              <Menu aria-hidden="true" className="h-7 w-7" />
            </summary>
            <nav
              aria-label="Menu principal"
              className="absolute right-0 top-full z-20 mt-2 flex min-w-48 flex-col rounded-xl border border-white/10 bg-[#121212] p-2 shadow-xl"
            >
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
            </nav>
          </details>
        </div>
      </div>
      
    </header>
  )
}

export default Header
