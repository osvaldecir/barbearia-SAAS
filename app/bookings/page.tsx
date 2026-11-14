import { getServerSession } from "next-auth"
import Link from "next/link"
import { authOptions } from "@/app/lib/auth-options"
import { db } from "@/_lib/prisma"
import BookingCancelButton from "./booking-cancel-button"

export default async function BookingsPage() {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email
  const user = email
    ? await db.user.findUnique({
        where: { email },
        select: { id: true },
      })
    : null
  const bookings = user
    ? await db.booking.findMany({
        where: { userId: user.id },
        include: {
          barbershopService: {
            include: {
              barbershop: { select: { name: true } },
            },
          },
        },
        orderBy: { date: "asc" },
      })
    : []

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-xl shadow-black/30">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
          Agenda
        </p>
        <h1 className="text-3xl font-semibold text-white">Meus agendamentos</h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400">
          Consulte os serviços, as datas e os horários das suas reservas.
        </p>
        {!email ? (
          <p className="mt-6 rounded-xl border border-white/10 p-4 text-sm text-zinc-300">
            Entre na sua conta pelo botão no topo da página para ver seus agendamentos.
          </p>
        ) : bookings.length === 0 ? (
          <p className="mt-6 rounded-xl border border-white/10 p-4 text-sm text-zinc-300">
            Você ainda não tem agendamentos.{" "}
            <Link href="/" className="font-semibold text-[#f7e257] underline">
              Escolher um serviço
            </Link>
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="rounded-xl border border-white/10 bg-black/20 p-4"
              >
                <p className="font-semibold text-white">
                  {booking.barbershopService.name}
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  {booking.barbershopService.barbershop.name}
                </p>
                <p className="mt-3 text-sm text-[#f7e257]">
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "full",
                    timeStyle: "short",
                    timeZone: "America/Sao_Paulo",
                  }).format(booking.date)}
                </p>
                <div className="mt-1">
                  <div className="flex items-center justify-between gap-3">
                  <p className="text-xs capitalize text-zinc-500">
                    {booking.status === "confirmed"
                      ? "Confirmado"
                      : booking.status === "cancelled" ||
                          booking.status === "canceled"
                        ? "Cancelado"
                        : booking.status}
                  </p>
                  {booking.status === "confirmed" &&
                    booking.date > new Date() && (
                      <BookingCancelButton
                        bookingId={booking.id}
                        isCancelled={false}
                      />
                    )}
                    {(booking.status === "cancelled" ||
                      booking.status === "canceled") && (
                      <BookingCancelButton
                        bookingId={booking.id}
                        isCancelled
                      />
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-[#f7e257] transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257]"
          >
            <span aria-hidden="true">←</span>
            Voltar
          </Link>
        </div>
      </div>
    </main>
  )
}
