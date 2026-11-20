import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/lib/auth-options"
import { isBarbershopOwner } from "@/app/lib/barbershop-owner"
import { db } from "@/_lib/prisma"

type RouteContext = { params: { id: string } }

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

  const result = await db.booking.deleteMany({
    where: {
      id: params.id,
      barbershopService: { barbershopId: barbershop.id },
    },
  })
  if (result.count === 0) {
    return NextResponse.json(
      { error: "Agendamento não encontrado." },
      { status: 404 },
    )
  }

  return NextResponse.json({ success: true })
}
