const scheduledPrices: Record<
  string,
  { weekday: number; fridaySaturday: number }
> = {
  cabelo: { weekday: 40, fridaySaturday: 45 },
  barba: { weekday: 40, fridaySaturday: 45 },
  "cabelo & barba": { weekday: 80, fridaySaturday: 90 },
}

const businessTimeZone = "America/Sao_Paulo"

export const getScheduledServicePrices = (
  serviceName: string,
  fallbackPrice: number,
) =>
  scheduledPrices[serviceName.trim().toLocaleLowerCase("pt-BR")] ?? {
    weekday: fallbackPrice,
    fridaySaturday: fallbackPrice,
  }

export const getServicePriceForWeekday = (
  serviceName: string,
  fallbackPrice: number,
  weekday: number,
) => {
  const prices = getScheduledServicePrices(serviceName, fallbackPrice)
  return weekday >= 1 && weekday <= 4
    ? prices.weekday
    : weekday === 5 || weekday === 6
      ? prices.fridaySaturday
      : fallbackPrice
}

export const getBusinessWeekday = (date: Date) => {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: businessTimeZone,
    weekday: "short",
  }).format(date)

  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekday)
}
