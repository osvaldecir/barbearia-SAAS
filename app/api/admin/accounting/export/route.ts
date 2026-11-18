import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/lib/auth-options"
import {
  accountingTimeZone,
  getAccountingMonthRange,
  isValidAccountingMonth,
} from "@/app/lib/accounting"
import { isBarbershopOwner } from "@/app/lib/barbershop-owner"
import {
  getBusinessWeekday,
  getServicePriceForWeekday,
} from "@/app/lib/service-pricing"
import { db } from "@/_lib/prisma"

const csvCell = (value: string | number) => {
  let text = String(value)
  if (/^[\s]*[=+\-@]/.test(text)) text = `'${text}`
  return `"${text.replace(/"/g, '""')}"`
}

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: accountingTimeZone,
  }).format(date)

const formatAmount = (value: number | string) =>
  Number(value).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!isBarbershopOwner(session?.user?.email)) {
    return NextResponse.json(
      { error: "Acesso não autorizado." },
      { status: 403 },
    )
  }

  const month = new URL(request.url).searchParams.get("month")
  if (!month || !isValidAccountingMonth(month)) {
    return NextResponse.json(
      { error: "Informe um mês válido." },
      { status: 400 },
    )
  }
  const range = getAccountingMonthRange(month)
  const barbershop = await db.barbershop.findFirst({
    where: { name: { equals: "shinider", mode: "insensitive" } },
    select: { id: true },
  })

  const [bookings, payments, expenses] = barbershop
    ? await Promise.all([
        db.booking.findMany({
          where: {
            date: { gte: range.start, lt: range.end },
            barbershopService: { barbershopId: barbershop.id },
          },
          include: {
            user: { select: { name: true } },
            barbershopService: { select: { name: true, price: true } },
          },
          orderBy: { date: "asc" },
        }),
        db.booking.findMany({
          where: {
            paidAt: { gte: range.start, lt: range.end },
            barbershopService: { barbershopId: barbershop.id },
          },
          include: {
            user: { select: { name: true } },
            barbershopService: { select: { name: true } },
          },
          orderBy: { paidAt: "asc" },
        }),
        db.barbershopExpense.findMany({
          where: {
            barbershopId: barbershop.id,
            date: { gte: range.start, lt: range.end },
          },
          orderBy: { date: "asc" },
        }),
      ])
    : [[], [], []]

  const rows = [
    [
      "Tipo",
      "Data",
      "Cliente/Descrição",
      "Serviço/Forma de pagamento",
      "Status",
      "Valor (R$)",
    ],
    ...bookings.map((booking) => [
      "Agendamento",
      formatDate(booking.date),
      booking.user.name ?? "Cliente",
      booking.barbershopService.name,
      booking.status,
      formatAmount(
        booking.status.toLowerCase() === "confirmed"
          ? getServicePriceForWeekday(
              booking.barbershopService.name,
              Number(booking.barbershopService.price),
              getBusinessWeekday(booking.date),
            )
          : 0,
      ),
    ]),
    ...payments.map((payment) => [
      "Entrada recebida",
      formatDate(payment.paidAt!),
      payment.user.name ?? "Cliente",
      payment.paymentMethod ?? payment.barbershopService.name,
      "Pago",
      formatAmount(Number(payment.paidAmount ?? 0)),
    ]),
    ...expenses.map((expense) => [
      "Despesa",
      formatDate(expense.date),
      expense.description,
      "",
      "Lançada",
      formatAmount(Number(expense.amount)),
    ]),
  ]

  const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(";")).join("\r\n")}`
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="contabilidade-${month}.csv"`,
      "Cache-Control": "no-store",
    },
  })
}
