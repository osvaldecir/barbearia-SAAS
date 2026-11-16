import { CalendarDays, Download, ReceiptText, Wallet } from "lucide-react"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/lib/auth-options"
import {
  accountingTimeZone,
  formatCurrency,
  getAccountingMonthRange,
  getCurrentAccountingMonth,
  isValidAccountingMonth,
  toCents,
} from "@/app/lib/accounting"
import { isBarbershopOwner } from "@/app/lib/barbershop-owner"
import { db } from "@/_lib/prisma"
import ExpenseDeleteButton from "./expense-delete-button"
import ExpenseForm from "./expense-form"
import PaymentButton from "./payment-button"

type AdminBookingsPageProps = {
  searchParams: { month?: string }
}

const formatDate = (date: Date, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("pt-BR", {
    ...options,
    timeZone: accountingTimeZone,
  }).format(date)

const bookingStatusLabel = (status: string) => {
  if (status === "confirmed") return "Confirmado"
  if (status === "cancelled" || status === "canceled") return "Cancelado"
  return status
}

export default async function AdminBookingsPage({
  searchParams,
}: AdminBookingsPageProps) {
  const session = await getServerSession(authOptions)
  if (!isBarbershopOwner(session?.user?.email)) redirect("/")

  const month =
    searchParams.month && isValidAccountingMonth(searchParams.month)
      ? searchParams.month
      : getCurrentAccountingMonth()
  const range = getAccountingMonthRange(month)
  const barbershop = await db.barbershop.findFirst({
    where: { name: { equals: "shinider", mode: "insensitive" } },
    select: { id: true, name: true },
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
          orderBy: { paidAt: "desc" },
        }),
        db.barbershopExpense.findMany({
          where: {
            barbershopId: barbershop.id,
            date: { gte: range.start, lt: range.end },
          },
          orderBy: { date: "desc" },
        }),
      ])
    : [[], [], []]

  const expectedCents = bookings.reduce(
    (total, booking) =>
      total +
      (booking.status.toLowerCase() === "confirmed"
        ? toCents(Number(booking.barbershopService.price))
        : 0),
    0,
  )
  const receivedCents = payments.reduce(
    (total, payment) => total + toCents(Number(payment.paidAmount ?? 0)),
    0,
  )
  const expenseCents = expenses.reduce(
    (total, expense) => total + toCents(Number(expense.amount)),
    0,
  )
  const serviceTotals = new Map<string, number>()
  for (const booking of bookings) {
    if (booking.status.toLowerCase() !== "confirmed") continue
    const name = booking.barbershopService.name
    serviceTotals.set(
      name,
      (serviceTotals.get(name) ?? 0) +
        toCents(Number(booking.barbershopService.price)),
    )
  }
  const monthLabel = formatDate(range.start, {
    month: "long",
    year: "numeric",
  })

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-xl shadow-black/30">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
            Área do proprietário
          </p>
          <h1 className="text-3xl font-semibold text-white">
            Gestão e contabilidade
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            {barbershop?.name ?? "Barbearia"} · relatório de {monthLabel}
          </p>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <form method="get" className="flex items-end gap-3">
              <label className="grid gap-1 text-xs text-zinc-400">
                Mês do relatório
                <input
                  type="month"
                  name="month"
                  defaultValue={month}
                  className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                />
              </label>
              <button
                type="submit"
                className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
              >
                Ver mês
              </button>
            </form>
            <a
              href={`/api/admin/accounting/export?month=${month}`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#f7e257] px-4 py-2 text-sm font-semibold text-black"
            >
              <Download aria-hidden="true" className="h-4 w-4" />
              Exportar CSV
            </a>
          </div>
        </section>

        <section
          aria-label="Resumo financeiro do mês"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            {
              label: "Previsto em agendamentos",
              value: formatCurrency(expectedCents),
              icon: CalendarDays,
            },
            {
              label: "Recebido registrado",
              value: formatCurrency(receivedCents),
              icon: Wallet,
            },
            {
              label: "Despesas lançadas",
              value: formatCurrency(expenseCents),
              icon: ReceiptText,
            },
            {
              label: "Saldo registrado",
              value: formatCurrency(receivedCents - expenseCents),
              icon: Wallet,
            },
          ].map(({ label, value, icon: Icon }) => (
            <article
              key={label}
              className="rounded-xl border border-white/10 bg-[#121212] p-4"
            >
              <Icon
                aria-hidden="true"
                className="mb-3 h-5 w-5 text-[#f7e257]"
              />
              <p className="text-xs text-zinc-400">{label}</p>
              <p className="mt-1 text-xl font-semibold text-white">{value}</p>
            </article>
          ))}
        </section>
        <p className="text-xs leading-5 text-zinc-500">
          O previsto soma os agendamentos confirmados do mês usando os preços
          atuais. O recebido considera apenas pagamentos registrados; o saldo
          subtrai as despesas lançadas. Este resumo não substitui a escrituração
          contábil.
        </p>

        <section className="rounded-2xl border border-white/10 bg-[#121212] p-6">
          <h2 className="text-xl font-semibold">Totais por serviço</h2>
          {serviceTotals.size ? (
            <ul className="mt-4 divide-y divide-white/10">
              {Array.from(serviceTotals.entries())
                .sort((a, b) => b[1] - a[1])
                .map(([name, total]) => (
                  <li
                    key={name}
                    className="flex justify-between gap-4 py-3 text-sm"
                  >
                    <span className="text-zinc-300">{name}</span>
                    <span className="font-medium text-white">
                      {formatCurrency(total)}
                    </span>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-zinc-400">
              Não há agendamentos confirmados neste mês.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#121212] p-6">
          <h2 className="text-xl font-semibold">
            Agendamentos de {monthLabel}
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Registre pagamentos ao recebê-los. O valor registrado usa o preço
            atual do serviço.
          </p>
          {bookings.length ? (
            <ul className="mt-4 space-y-3">
              {bookings.map((booking) => (
                <li
                  key={booking.id}
                  className="grid gap-3 rounded-xl border border-white/10 bg-black/20 p-4 lg:grid-cols-[1fr_auto]"
                >
                  <div>
                    <p className="font-semibold">
                      {booking.user.name ?? "Cliente"} ·{" "}
                      {booking.barbershopService.name}
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                      {formatDate(booking.date, {
                        dateStyle: "full",
                        timeStyle: "short",
                      })}
                      {" · "}
                      {bookingStatusLabel(booking.status)}
                    </p>
                    <p className="mt-1 text-sm text-[#f7e257]">
                      {formatCurrency(
                        toCents(Number(booking.barbershopService.price)),
                      )}
                    </p>
                  </div>
                  {booking.status.toLowerCase() === "confirmed" ||
                  booking.paidAt ? (
                    <PaymentButton
                      bookingId={booking.id}
                      paidAt={booking.paidAt}
                      paidAmount={
                        booking.paidAmount === null
                          ? null
                          : Number(booking.paidAmount)
                      }
                      paymentMethod={booking.paymentMethod}
                    />
                  ) : (
                    <span className="text-xs text-zinc-500">
                      Sem pagamento registrado
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-zinc-400">
              Não há agendamentos neste mês.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#121212] p-6">
          <h2 className="text-xl font-semibold">
            Entradas recebidas em {monthLabel}
          </h2>
          {payments.length ? (
            <ul className="mt-4 divide-y divide-white/10">
              {payments.map((payment) => (
                <li
                  key={payment.id}
                  className="flex flex-wrap justify-between gap-2 py-3 text-sm"
                >
                  <span className="text-zinc-300">
                    {payment.user.name ?? "Cliente"} ·{" "}
                    {payment.barbershopService.name} ·{" "}
                    {payment.paymentMethod ?? "Forma não informada"} ·{" "}
                    {formatDate(payment.paidAt!, {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                  <span className="font-medium text-emerald-300">
                    {formatCurrency(toCents(Number(payment.paidAmount ?? 0)))}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-zinc-400">
              Não há pagamentos registrados neste mês.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#121212] p-6">
          <h2 className="text-xl font-semibold">Despesas de {monthLabel}</h2>
          <ExpenseForm month={month} />
          {expenses.length ? (
            <ul className="mt-4 divide-y divide-white/10">
              {expenses.map((expense) => (
                <li
                  key={expense.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {expense.description}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {formatDate(expense.date, {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-red-300">
                      {formatCurrency(toCents(Number(expense.amount)))}
                    </span>
                    <ExpenseDeleteButton expenseId={expense.id} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-zinc-400">
              Não há despesas lançadas neste mês.
            </p>
          )}
        </section>

        <div className="pb-4">
          <Link href="/" className="text-sm text-[#f7e257] underline">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </main>
  )
}
