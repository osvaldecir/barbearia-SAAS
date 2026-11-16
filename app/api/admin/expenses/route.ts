import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/lib/auth-options"
import {
  getAccountingMonthRange,
  isValidAccountingMonth,
} from "@/app/lib/accounting"
import { isBarbershopOwner } from "@/app/lib/barbershop-owner"
import { db } from "@/_lib/prisma"

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
    !("description" in body) ||
    typeof body.description !== "string" ||
    !body.description.trim() ||
    body.description.trim().length > 120 ||
    !("amount" in body) ||
    typeof body.amount !== "number" ||
    !Number.isFinite(body.amount) ||
    body.amount <= 0 ||
    body.amount > 99999999 ||
    !("date" in body) ||
    typeof body.date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(body.date) ||
    !("month" in body) ||
    typeof body.month !== "string" ||
    !isValidAccountingMonth(body.month)
  ) {
    return NextResponse.json(
      { error: "Informe uma descrição e um valor de despesa válidos." },
      { status: 400 },
    )
  }

  const [year, monthNumber, day] = body.date.split("-").map(Number)
  const expenseDate = new Date(Date.UTC(year, monthNumber - 1, day, 3))
  const range = getAccountingMonthRange(body.month)
  if (
    expenseDate.toISOString().slice(0, 10) !== body.date ||
    expenseDate < range.start ||
    expenseDate >= range.end
  ) {
    return NextResponse.json(
      { error: "A data da despesa deve pertencer ao mês selecionado." },
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

  await db.barbershopExpense.create({
    data: {
      description: body.description.trim(),
      amount: body.amount.toFixed(2),
      date: expenseDate,
      barbershopId: barbershop.id,
    },
  })

  return NextResponse.json({ success: true }, { status: 201 })
}
