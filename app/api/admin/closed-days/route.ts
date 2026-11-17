import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/lib/auth-options"
import { isBarbershopOwner } from "@/app/lib/barbershop-owner"
import { db } from "@/_lib/prisma"

const maxClosedDate = "2050-12-31"
const businessTimeZone = "America/Sao_Paulo"

const getBusinessDate = (date: Date) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: businessTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)
  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  )

  return `${values.year}-${values.month}-${values.day}`
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!isBarbershopOwner(session?.user?.email)) {
    return NextResponse.json(
      { error: "Acesso não autorizado." },
      { status: 403 },
    )
  }

  const body: unknown = await request.json()
  if (
    typeof body !== "object" ||
    body === null ||
    !("date" in body) ||
    typeof body.date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(body.date)
  ) {
    return NextResponse.json(
      { error: "Informe uma data válida para bloquear." },
      { status: 400 },
    )
  }

  const date = new Date(`${body.date}T00:00:00.000Z`)
  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== body.date ||
    body.date < getBusinessDate(new Date()) ||
    body.date > maxClosedDate
  ) {
    return NextResponse.json(
      { error: "A data deve ser hoje ou futura, até 31/12/2050." },
      { status: 400 },
    )
  }

  const barbershop = await db.barbershop.findFirst({
    where: { name: { equals: "shinider", mode: "insensitive" } },
    select: { id: true },
  })
  if (!barbershop) {
    return NextResponse.json(
      { error: "Barbearia não encontrada." },
      { status: 404 },
    )
  }

  await db.barbershopClosedDay.upsert({
    where: {
      barbershopId_date: {
        barbershopId: barbershop.id,
        date,
      },
    },
    update: {},
    create: {
      date,
      barbershopId: barbershop.id,
    },
    select: { id: true },
  })

  return NextResponse.json({ success: true }, { status: 201 })
}
