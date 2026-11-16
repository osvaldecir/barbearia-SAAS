import { CalendarDays } from "lucide-react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/lib/auth-options"
import { isBarbershopOwner } from "@/app/lib/barbershop-owner"
import { db } from "@/_lib/prisma"

export default async function AdminBookingsPage() {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email

  if (!isBarbershopOwner(email)) {
    redirect("/")
  }

  const barbershop = await db.barbershop.findFirst({
    where: { name: { equals: "shinider", mode: "insensitive" } },
    select: { id: true, name: true },
  })
  const bookings = barbershop
    ? await db.booking.findMany({
        where: {
          barbershopService: { barbershopId: barbershop.id },
        },
        include: {
          user: { select: { name: true } },
          barbershopService: { select: { name: true } },
        },
        orderBy: { date: "asc" },
      })
    : []

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-xl shadow-black/30">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
          Área do proprietário
        </p>
        <h1 className="text-3xl font-semibold text-white">
          Agendamentos da barbearia
        </h1>
        <p className="mt-3 text-sm text-zinc-400">
          {barbershop?.name ?? "Barbearia"} · {bookings.length}{" "}
          {bookings.length === 1 ? "agendamento" : "agendamentos"}
        </p>

        {bookings.length === 0 ? (
          <p className="mt-6 rounded-xl border border-white/10 p-4 text-sm text-zinc-300">
            Ainda não há agendamentos para exibir.
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="grid gap-3 rounded-xl border border-white/10 bg-black/20 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div>
                  <p className="font-semibold text-white">
                    {booking.user.name ?? "Cliente"} ·{" "}
                    {booking.barbershopService.name}
                  </p>
                  {booking.whatsappPhone && (
                    <p className="mt-1 text-sm text-zinc-400">
                      WhatsApp: {booking.whatsappPhone}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-[#f7e257]">
                    {new Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "full",
                      timeStyle: "short",
                      timeZone: "America/Sao_Paulo",
                    }).format(booking.date)}
                  </p>
                </div>
                <span
                  className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                    booking.status === "confirmed"
                      ? "bg-emerald-500/10 text-emerald-300"
                      : "bg-white/10 text-zinc-300"
                  }`}
                >
                  <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
                  {booking.status === "confirmed"
                    ? "Confirmado"
                    : booking.status === "cancelled" ||
                        booking.status === "canceled"
                      ? "Cancelado"
                      : booking.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
