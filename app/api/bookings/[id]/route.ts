import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/lib/auth-options"
import { db } from "@/_lib/prisma"

type BookingRouteContext = {
  params: {
    id: string
  }
}

export async function PATCH(_request: Request, { params }: BookingRouteContext) {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email

  if (!email) {
    return NextResponse.json(
      { error: "Entre na sua conta para cancelar o agendamento." },
      { status: 401 },
    )
  }

  const user = await db.user.findUnique({
    where: { email },
    select: { id: true },
  })

  if (!user) {
    return NextResponse.json(
      { error: "Não foi possível identificar sua conta. Entre novamente." },
      { status: 401 },
    )
  }

  const result = await db.booking.updateMany({
    where: {
      id: params.id,
      userId: user.id,
      status: "confirmed",
      date: { gt: new Date() },
    },
    data: { status: "cancelled" },
  })

  if (result.count === 0) {
    return NextResponse.json(
      { error: "Agendamento não encontrado ou não pode mais ser cancelado." },
      { status: 404 },
    )
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(
  _request: Request,
  { params }: BookingRouteContext,
) {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email

  if (!email) {
    return NextResponse.json(
      { error: "Entre na sua conta para apagar o agendamento." },
      { status: 401 },
    )
  }

  const user = await db.user.findUnique({
    where: { email },
    select: { id: true },
  })

  if (!user) {
    return NextResponse.json(
      { error: "Não foi possível identificar sua conta. Entre novamente." },
      { status: 401 },
    )
  }

  const result = await db.booking.deleteMany({
    where: {
      id: params.id,
      userId: user.id,
      status: { in: ["cancelled", "canceled"] },
    },
  })

  if (result.count === 0) {
    return NextResponse.json(
      { error: "Agendamento cancelado não encontrado." },
      { status: 404 },
    )
  }

  return NextResponse.json({ success: true })
}
