import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/_lib/prisma"
import ReservationCalendar from "./reservation-calendar"

type ReservationPageProps = {
  params: {
    barbershopId: string
    serviceId: string
  }
}

const ReservationPage = async ({ params }: ReservationPageProps) => {
  const service = await db.barbershopService.findFirst({
    where: {
      id: params.serviceId,
      barbershopId: params.barbershopId,
    },
    include: {
      barbershop: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!service) {
    notFound()
  }

  const initialDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(new Date())
    .reduce<Record<string, string>>((parts, { type, value }) => {
      parts[type] = value
      return parts
    }, {})
  const startDate = `${initialDate.year}-${initialDate.month}-${initialDate.day}`
  const bookings = await db.booking.findMany({
    where: {
      barbershopService: {
        barbershopId: params.barbershopId,
      },
      date: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        lt: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
      },
    },
    select: {
      date: true,
      status: true,
      barbershopService: {
        select: {
          duration: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  })

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-12 text-white sm:px-6">
      <section className="mx-auto w-full max-w-5xl rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-xl sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#f7e257]">
          Fazer reserva
        </p>
        <h1 className="mt-3 text-2xl font-bold">
          Escolha uma data e horário
        </h1>
        <p className="mt-2 leading-7 text-zinc-300">
          {service.name} · {service.barbershop.name}
        </p>
        <ReservationCalendar
          initialDate={startDate}
          serviceId={service.id}
          serviceName={service.name}
          barbershopName={service.barbershop.name}
          serviceDuration={service.duration ?? 30}
          bookings={bookings.map((booking) => ({
            date: booking.date.toISOString(),
            duration: booking.barbershopService.duration,
            status: booking.status,
          }))}
        />
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/barbershops/${params.barbershopId}`}
            className="inline-flex rounded-lg border border-white/10 px-5 py-3 text-sm font-bold text-zinc-200 transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257]"
          >
            Voltar aos serviços
          </Link>
          <Link
            href="/"
            className="inline-flex rounded-lg border border-[#f7e257]/40 px-5 py-3 text-sm font-bold text-[#f7e257] transition hover:bg-[#f7e257]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257]"
          >
            Voltar à tela inicial
          </Link>
        </div>
      </section>
    </main>
  )
}

export default ReservationPage
