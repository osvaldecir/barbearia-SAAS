const fixedNationalHolidays = new Set([
  "01-01",
  "04-21",
  "05-01",
  "09-07",
  "10-12",
  "11-02",
  "11-15",
  "11-20",
  "12-25",
])

const getEasterSunday = (year: number) => {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1

  return new Date(Date.UTC(year, month - 1, day))
}

export const isBrazilianNationalHoliday = (date: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false

  const year = Number(date.slice(0, 4))
  const monthDay = date.slice(5)
  const parsedDate = new Date(`${date}T00:00:00.000Z`)
  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== date
  ) {
    return false
  }

  if (fixedNationalHolidays.has(monthDay)) return true

  const goodFriday = getEasterSunday(year)
  goodFriday.setUTCDate(goodFriday.getUTCDate() - 2)

  return goodFriday.toISOString().slice(0, 10) === date
}
