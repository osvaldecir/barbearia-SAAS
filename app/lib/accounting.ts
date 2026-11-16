export const accountingTimeZone = "America/Sao_Paulo"

export const isValidAccountingMonth = (month: string) => {
  const match = /^(\d{4})-(\d{2})$/.exec(month)
  return Boolean(match && Number(match[2]) >= 1 && Number(match[2]) <= 12)
}

export const getCurrentAccountingMonth = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: accountingTimeZone,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(date)
  const year = parts.find((part) => part.type === "year")?.value
  const month = parts.find((part) => part.type === "month")?.value

  if (!year || !month) {
    throw new Error("Não foi possível determinar o mês atual.")
  }

  return `${year}-${month}`
}

export const getAccountingMonthRange = (month: string) => {
  if (!isValidAccountingMonth(month)) {
    throw new Error("O mês informado para o relatório é inválido.")
  }

  const [year, monthNumber] = month.split("-").map(Number)
  return {
    start: new Date(Date.UTC(year, monthNumber - 1, 1, 3)),
    end: new Date(Date.UTC(year, monthNumber, 1, 3)),
  }
}

export const toCents = (amount: number | string) =>
  Math.round(Number(amount) * 100)

export const formatCurrency = (cents: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100)
