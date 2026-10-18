import { CalendarDays } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const Header = () => {
  return (
    <header className="relative z-10 border-b border-white/10 bg-[#080808]/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Image
          src="/capa.png"
          alt="FSW Barber"
          width={400}
          height={150}
          priority
          className="h-auto w-[150px] sm:w-[170px]"
        />
        <Link
          href="#booking-heading"
          className="inline-flex items-center gap-2 rounded-full border border-[#f7e257]/30 bg-[#f7e257]/10 px-4 py-2 text-sm font-medium text-[#f7e257] transition hover:border-[#f7e257]/60 hover:bg-[#f7e257]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]"
        >
          <CalendarDays aria-hidden="true" className="h-4 w-4" />
          <span className="hidden sm:inline">Meus agendamentos</span>
          <span className="sm:hidden">Agendamentos</span>
        </Link>
      </div>
    </header>
  )
}

export default Header
