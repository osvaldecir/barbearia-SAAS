import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/_lib/prisma"

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

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-4 py-12 text-white">
      <section className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-xl sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#f7e257]">
          Fazer reserva
        </p>
        <h1 className="mt-3 text-2xl font-bold">Agendamento em breve</h1>
        <p className="mt-4 leading-7 text-zinc-300">
          Você selecionou <strong>{service.name}</strong> na{" "}
          <strong>{service.barbershop.name}</strong>. Estamos preparando esta
          página para você concluir sua reserva.
        </p>
        <Link
          href={`/barbershops/${params.barbershopId}`}
          className="mt-6 inline-flex rounded-lg bg-[#f7e257] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#ffec70] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
        >
          Voltar aos serviços
        </Link>
      </section>
    </main>
  )
}

export default ReservationPage
