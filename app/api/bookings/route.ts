import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/lib/auth-options"
import { db } from "@/_lib/prisma"

const businessTimeZone = "America/Sao_Paulo"
const slotIntervalMinutes = 30

const getBusinessTimeParts = (date: Date) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: businessTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date)

  return Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  ) as Record<string, string>
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email

  if (!email) {
    return NextResponse.json(
      { error: "Entre na sua conta para confirmar a reserva." },
      { status: 401 },
    )
  }

  const body: unknown = await request.json()
  if (
    typeof body !== "object" ||
    body === null ||
    !("serviceId" in body) ||
    typeof body.serviceId !== "string" ||
    !("date" in body) ||
    typeof body.date !== "string"
  ) {
    return NextResponse.json(
      { error: "Selecione um serviço, uma data e um horário válidos." },
      { status: 400 },
    )
  }

  const start = new Date(body.date)
  if (
    Number.isNaN(start.getTime()) ||
    start.toISOString() !== body.date ||
    start.getUTCSeconds() !== 0 ||
    start.getUTCMilliseconds() !== 0
  ) {
    return NextResponse.json(
      { error: "A data e o horário selecionados são inválidos." },
      { status: 400 },
    )
  }

  const timeParts = getBusinessTimeParts(start)
  const localHour = Number(timeParts.hour)
  const localMinute = Number(timeParts.minute)
  const localDate = `${timeParts.year}-${timeParts.month}-${timeParts.day}`
  const localWeekday = new Date(`${localDate}T12:00:00.000Z`).getUTCDay()

  if (
    start.getTime() <= Date.now() ||
    localWeekday === 0 ||
    localHour < 8 ||
    localHour >= 22 ||
    localMinute % slotIntervalMinutes !== 0
  ) {
    return NextResponse.json(
      { error: "Esse horário não está dentro do período de atendimento." },
      { status: 400 },
    )
  }

  const [user, service] = await Promise.all([
    db.user.findUnique({
      where: { email },
      select: { id: true },
    }),
    db.barbershopService.findUnique({
      where: { id: body.serviceId },
      select: {
        id: true,
        duration: true,
        barbershopId: true,
      },
    }),
  ])

  if (!user) {
    return NextResponse.json(
      { error: "Não foi possível identificar sua conta. Entre novamente." },
      { status: 401 },
    )
  }
  if (!service) {
    return NextResponse.json(
      { error: "O serviço selecionado não foi encontrado." },
      { status: 404 },
    )
  }

  const duration = service.duration ?? slotIntervalMinutes
  const end = new Date(start.getTime() + duration * 60_000)
  const endParts = getBusinessTimeParts(end)
  const endTime = Number(endParts.hour) * 60 + Number(endParts.minute)

  if (
    `${endParts.year}-${endParts.month}-${endParts.day}` !== localDate ||
    endTime > 22 * 60
  ) {
    return NextResponse.json(
      { error: "Esse serviço não cabe no horário de atendimento selecionado." },
      { status: 400 },
    )
  }

  const services = await db.barbershopService.findMany({
    where: { barbershopId: service.barbershopId },
    select: { duration: true },
  })
  const longestService = Math.max(
    slotIntervalMinutes,
    ...services.map(({ duration: serviceDuration }) => serviceDuration ?? slotIntervalMinutes),
  )
  const existingBookings = await db.booking.findMany({
    where: {
      barbershopService: { barbershopId: service.barbershopId },
      date: {
        gte: new Date(start.getTime() - longestService * 60_000),
        lt: end,
      },
    },
    select: {
      date: true,
      status: true,
      barbershopService: { select: { duration: true } },
    },
  })
  const hasConflict = existingBookings.some((booking) => {
    if (["canceled", "cancelled"].includes(booking.status.toLowerCase())) {
      return false
    }

    const bookingStart = booking.date.getTime()
    const bookingEnd =
      bookingStart +
      (booking.barbershopService.duration ?? slotIntervalMinutes) * 60_000

    return start.getTime() < bookingEnd && end.getTime() > bookingStart
  })

  if (hasConflict) {
    return NextResponse.json(
      { error: "Esse horário acabou de ser reservado. Escolha outro horário." },
      { status: 409 },
    )
  }

  const booking = await db.booking.create({
    data: {
      userId: user.id,
      barbershopServiceId: service.id,
      date: start,
      status: "confirmed",
    },
    select: { id: true, date: true },
  })

  return NextResponse.json(
    { booking: { id: booking.id, date: booking.date.toISOString() } },
    { status: 201 },
  )
}
