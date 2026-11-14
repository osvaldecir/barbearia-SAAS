"use client"

import Link from "next/link"
import { signIn } from "next-auth/react"
import { useMemo, useState } from "react"

type ReservationCalendarProps = {
  initialDate: string
  serviceId: string
  serviceName: string
  barbershopName: string
  serviceDuration: number
  bookings: {
    date: string
    duration: number | null
    status: string
  }[]
}

const businessTimeZone = "America/Sao_Paulo"
const bookingWindowDays = 30
const slotIntervalMinutes = 30
const openingHour = 8
const closingHour = 22

const addDays = (date: string, days: number) => {
  const value = new Date(`${date}T12:00:00.000Z`)
  value.setUTCDate(value.getUTCDate() + days)
  return value.toISOString().slice(0, 10)
}

const getDateTimeInBusinessTimeZone = (
  date: string,
  hour: number,
  minute: number,
) => {
  const [year, month, day] = date.split("-").map(Number)
  const targetTime = Date.UTC(year, month - 1, day, hour, minute)
  let timestamp = targetTime
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: businessTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const parts = formatter.formatToParts(new Date(timestamp))
    const values = Object.fromEntries(
      parts.map(({ type, value }) => [type, Number(value)]),
    )
    const representedTime = Date.UTC(
      values.year,
      values.month - 1,
      values.day,
      values.hour,
      values.minute,
    )
    timestamp += targetTime - representedTime
  }

  return timestamp
}

const formatDate = (date: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("pt-BR", {
    ...options,
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00.000Z`))

const ReservationCalendar = ({
  initialDate,
  serviceId,
  serviceName,
  barbershopName,
  serviceDuration,
  bookings,
}: ReservationCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState("")
  const [requiresAuthentication, setRequiresAuthentication] = useState(false)
  const [whatsappProfileHref, setWhatsappProfileHref] = useState("")
  const [confirmedBooking, setConfirmedBooking] = useState<string | null>(null)
  const [visibleMonth, setVisibleMonth] = useState(
    `${initialDate.slice(0, 7)}-01`,
  )
  const lastDate = addDays(initialDate, bookingWindowDays - 1)

  const slotsByDate = useMemo(() => {
    const slots: Record<string, string[]> = {}
    const activeBookings = bookings.filter(
      ({ status }) => !["canceled", "cancelled"].includes(status.toLowerCase()),
    )
    const duration = serviceDuration || slotIntervalMinutes

    for (let day = 0; day < bookingWindowDays; day += 1) {
      const date = addDays(initialDate, day)
      const weekday = new Date(`${date}T12:00:00.000Z`).getUTCDay()
      slots[date] = []

      if (weekday === 0) {
        continue
      }

      for (
        let startMinute = openingHour * 60;
        startMinute + duration <= closingHour * 60;
        startMinute += slotIntervalMinutes
      ) {
        const start = getDateTimeInBusinessTimeZone(
          date,
          Math.floor(startMinute / 60),
          startMinute % 60,
        )
        const end = start + duration * 60_000

        if (start <= Date.now()) {
          continue
        }

        const hasConflict = activeBookings.some((booking) => {
          const bookingStart = new Date(booking.date).getTime()
          const bookingEnd =
            bookingStart + (booking.duration || slotIntervalMinutes) * 60_000

          return start < bookingEnd && end > bookingStart
        })

        if (!hasConflict) {
          slots[date].push(
            `${String(Math.floor(startMinute / 60)).padStart(2, "0")}:${String(startMinute % 60).padStart(2, "0")}`,
          )
        }
      }
    }

    return slots
  }, [bookings, initialDate, serviceDuration])

  const firstDayOfMonth = new Date(`${visibleMonth}T12:00:00.000Z`)
  const daysInMonth = new Date(
    Date.UTC(
      firstDayOfMonth.getUTCFullYear(),
      firstDayOfMonth.getUTCMonth() + 1,
      0,
    ),
  ).getUTCDate()
  const leadingDays = firstDayOfMonth.getUTCDay()
  const monthDates = Array.from({ length: daysInMonth }, (_, index) =>
    addDays(visibleMonth, index),
  )
  const previousMonth =
    addDays(`${visibleMonth.slice(0, 7)}-01`, -1).slice(0, 7) + "-01"
  const nextMonth =
    addDays(`${visibleMonth.slice(0, 7)}-01`, 32).slice(0, 7) + "-01"
  const canGoToPreviousMonth = previousMonth >= `${initialDate.slice(0, 7)}-01`
  const canGoToNextMonth = nextMonth <= `${lastDate.slice(0, 7)}-01`
  const activeDate =
    selectedDate ??
    monthDates.find((date) => slotsByDate[date]?.length > 0) ??
    monthDates.find((date) => date >= initialDate && date <= lastDate) ??
    initialDate
  const selectedSlots = slotsByDate[activeDate] ?? []

  const confirmBooking = async () => {
    if (!selectedTime || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setSubmissionError("")
    setRequiresAuthentication(false)
    setConfirmedBooking(null)

    try {
      const [hour, minute] = selectedTime.split(":").map(Number)
      const date = new Date(
        getDateTimeInBusinessTimeZone(activeDate, hour, minute),
      ).toISOString()
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, date }),
      })
      const result = (await response.json()) as {
        error?: string
        requiresWhatsappProfile?: boolean
        booking?: { date: string }
      }

      if (!response.ok || !result.booking) {
        setRequiresAuthentication(response.status === 401)
        if (result.requiresWhatsappProfile) {
          setWhatsappProfileHref(
            `/complete-profile?returnTo=${encodeURIComponent(`${window.location.pathname}${window.location.search}`)}`,
          )
        }
        setSubmissionError(
          result.error ??
            "Não foi possível confirmar a reserva. Tente novamente.",
        )
        return
      }

      setConfirmedBooking(result.booking.date)
    } catch {
      setSubmissionError(
        "Não foi possível confirmar a reserva. Verifique sua conexão e tente novamente.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
      <section
        aria-label="Calendário de disponibilidade"
        className="rounded-2xl border border-white/10 bg-[#121212] p-4 sm:p-6"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setVisibleMonth(previousMonth)
              setSelectedDate(null)
              setSelectedTime(null)
            }}
            disabled={!canGoToPreviousMonth}
            aria-label="Mês anterior"
            className="rounded-lg border border-white/10 px-3 py-2 text-zinc-200 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ‹
          </button>
          <h2 className="text-lg font-semibold capitalize text-white">
            {formatDate(visibleMonth, { month: "long", year: "numeric" })}
          </h2>
          <button
            type="button"
            onClick={() => {
              setVisibleMonth(nextMonth)
              setSelectedDate(null)
              setSelectedTime(null)
            }}
            disabled={!canGoToNextMonth}
            aria-label="Próximo mês"
            className="rounded-lg border border-white/10 px-3 py-2 text-zinc-200 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-zinc-500">
          {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => (
            <span key={`${day}-${index}`} className="py-2">
              {day}
            </span>
          ))}
          {Array.from({ length: leadingDays }, (_, index) => (
            <span key={`empty-${index}`} aria-hidden="true" />
          ))}
          {monthDates.map((date) => {
            const isInRange = date >= initialDate && date <= lastDate
            const isClosedSunday =
              new Date(`${date}T12:00:00.000Z`).getUTCDay() === 0
            const isAvailable =
              isInRange &&
              !isClosedSunday &&
              (slotsByDate[date]?.length ?? 0) > 0
            const isSelected = activeDate === date

            return (
              <button
                key={date}
                type="button"
                disabled={!isAvailable}
                aria-label={`${formatDate(date, { dateStyle: "full" })}${isAvailable ? `, ${slotsByDate[date].length} horários disponíveis` : ", sem horários disponíveis"}`}
                aria-pressed={isSelected}
                onClick={() => {
                  setSelectedDate(date)
                  setSelectedTime(null)
                }}
                className={`aspect-square rounded-lg text-sm transition ${
                  isSelected
                    ? "bg-[#f7e257] font-bold text-black"
                    : isAvailable
                      ? "text-white hover:bg-[#f7e257]/15"
                      : "cursor-not-allowed text-zinc-700"
                }`}
              >
                {Number(date.slice(-2))}
              </button>
            )
          })}
        </div>
        <p className="mt-5 text-xs text-zinc-500">
          Segunda a sábado, das 08h às 22h. Horários de 30 em 30 minutos.
        </p>
      </section>

      <section
        aria-labelledby="available-times-heading"
        className="rounded-2xl border border-white/10 bg-[#121212] p-4 sm:p-6"
      >
        <h2
          id="available-times-heading"
          className="text-lg font-semibold text-white"
        >
          Horários disponíveis
        </h2>
        <p className="mt-1 text-sm capitalize text-zinc-400">
          {formatDate(activeDate, {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
        {selectedSlots.length > 0 ? (
          <div className="mt-5 grid grid-cols-3 gap-2">
            {selectedSlots.map((time) => (
              <button
                key={time}
                type="button"
                aria-pressed={selectedTime === time}
                onClick={() => setSelectedTime(time)}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                  selectedTime === time
                    ? "border-[#f7e257] bg-[#f7e257] text-black"
                    : "border-white/10 text-zinc-200 hover:border-[#f7e257]/60 hover:text-[#f7e257]"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-5 rounded-lg border border-white/10 px-4 py-3 text-sm text-zinc-400">
            Não há horários disponíveis nesta data. Selecione outro dia.
          </p>
        )}
        {selectedTime && (
          <p className="mt-5 text-sm text-zinc-300" role="status">
            Horário selecionado:{" "}
            <strong className="text-[#f7e257]">{selectedTime}</strong>
          </p>
        )}
        {selectedTime && (
          <button
            type="button"
            onClick={confirmBooking}
            disabled={isSubmitting}
            className="mt-5 w-full rounded-lg bg-[#f7e257] px-5 py-3 font-bold text-black transition hover:bg-[#ffec70] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257] disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting ? "Confirmando..." : "Confirmar reserva"}
          </button>
        )}
        {submissionError && (
          <div role="alert" className="mt-4 text-sm text-red-400">
            <p>{submissionError}</p>
            {requiresAuthentication && (
              <button
                type="button"
                onClick={() => {
                  const returnTo = `${window.location.pathname}${window.location.search}`
                  void signIn("google", {
                    callbackUrl: `/complete-profile?returnTo=${encodeURIComponent(returnTo)}`,
                  })
                }}
                className="mt-2 font-semibold underline underline-offset-4"
              >
                Entrar com Google
              </button>
            )}
            {whatsappProfileHref && (
              <Link
                href={whatsappProfileHref}
                className="mt-2 inline-flex font-semibold text-[#f7e257] underline underline-offset-4"
              >
                Cadastrar celular
              </Link>
            )}
          </div>
        )}
        {confirmedBooking && (
          <div
            role="status"
            className="mt-5 rounded-xl border border-[#f7e257]/30 bg-[#f7e257]/10 p-4 text-sm text-zinc-200"
          >
            <p className="font-semibold text-[#f7e257]">Reserva confirmada!</p>
            <p className="mt-2">
              {serviceName} · {barbershopName}
            </p>
            <p className="mt-1">
              {new Intl.DateTimeFormat("pt-BR", {
                dateStyle: "long",
                timeStyle: "short",
                timeZone: businessTimeZone,
              }).format(new Date(confirmedBooking))}
            </p>
            <Link
              href="/bookings"
              className="mt-3 inline-flex font-semibold text-[#f7e257] underline underline-offset-4"
            >
              Ver meus agendamentos
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}

export default ReservationCalendar
