import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/lib/auth-options"
import { isBarbershopOwner } from "@/app/lib/barbershop-owner"
import {
  getBusinessWeekday,
  getServicePriceForWeekday,
} from "@/app/lib/service-pricing"
import { db } from "@/_lib/prisma"

type RouteContext = { params: { id: string } }

export async function PATCH(request: Request, { params }: RouteContext) {
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
    !("paymentMethod" in body) ||
    typeof body.paymentMethod !== "string" ||
    !["Dinheiro", "PIX", "Cartão"].includes(body.paymentMethod)
  ) {
    return NextResponse.json(
      { error: "Selecione uma forma de pagamento válida." },
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

  const booking = await db.booking.findFirst({
    where: {
      id: params.id,
      status: "confirmed",
      paidAt: null,
      barbershopService: { barbershopId: barbershop.id },
    },
    select: {
      id: true,
      date: true,
      barbershopService: { select: { name: true, price: true } },
    },
  })
  if (!booking) {
    return NextResponse.json(
      { error: "Agendamento não encontrado ou já registrado como pago." },
      { status: 404 },
    )
  }

  const price = getServicePriceForWeekday(
    booking.barbershopService.name,
    Number(booking.barbershopService.price),
    getBusinessWeekday(booking.date),
  )
  const result = await db.booking.updateMany({
    where: {
      id: booking.id,
      paidAt: null,
      barbershopService: { barbershopId: barbershop.id },
    },
    data: {
      paidAt: new Date(),
      paidAmount: price,
      paymentMethod: body.paymentMethod,
    },
  })
  if (result.count === 0) {
    return NextResponse.json(
      { error: "O pagamento deste agendamento já foi registrado." },
      { status: 409 },
    )
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions)
  if (!isBarbershopOwner(session?.user?.email)) {
    return NextResponse.json(
      { error: "Acesso não autorizado." },
      { status: 403 },
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

  const result = await db.booking.updateMany({
    where: {
      id: params.id,
      paidAt: { not: null },
      barbershopService: { barbershopId: barbershop.id },
    },
    data: { paidAt: null, paidAmount: null, paymentMethod: null },
  })
  if (result.count === 0) {
    return NextResponse.json(
      { error: "Pagamento não encontrado para este agendamento." },
      { status: 404 },
    )
  }

  return NextResponse.json({ success: true })
}
