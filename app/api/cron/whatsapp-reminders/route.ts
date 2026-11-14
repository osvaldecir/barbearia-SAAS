import { timingSafeEqual } from "node:crypto"
import { NextResponse } from "next/server"
import { db } from "@/_lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const businessTimeZone = "America/Sao_Paulo"

const getBusinessDate = (date: Date) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: businessTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)
  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  )

  return `${values.year}-${values.month}-${values.day}`
}

const getDateTimeInBusinessTimeZone = (
  date: string,
  hour: number,
  minute = 0,
) => {
  const [year, month, day] = date.split("-").map(Number)
  const targetTime = Date.UTC(year, month - 1, day, hour, minute)
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: businessTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })
  let timestamp = targetTime

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

  return new Date(timestamp)
}

const isAuthorized = (request: Request, secret: string) => {
  const provided = request.headers
    .get("authorization")
    ?.replace(/^Bearer /i, "")
  if (!provided) {
    return false
  }

  const expectedBuffer = Buffer.from(secret)
  const providedBuffer = Buffer.from(provided)
  return (
    expectedBuffer.length === providedBuffer.length &&
    timingSafeEqual(expectedBuffer, providedBuffer)
  )
}

const formatBusinessDate = (date: Date) =>
  new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    timeZone: businessTimeZone,
  }).format(date)

const getBusinessMinutesSinceMidnight = (date: Date) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: businessTimeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date)
  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, Number(value)]),
  )

  return values.hour * 60 + values.minute
}

const formatBusinessTime = (date: Date) =>
  new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: businessTimeZone,
  }).format(date)

const getWhatsAppConfig = () => {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const apiVersion = process.env.WHATSAPP_API_VERSION
  const templateName = process.env.WHATSAPP_REMINDER_TEMPLATE_NAME

  if (
    !accessToken ||
    !phoneNumberId ||
    !/^\d+$/.test(phoneNumberId) ||
    !apiVersion ||
    !/^v\d+\.\d+$/.test(apiVersion) ||
    !templateName
  ) {
    return null
  }

  return {
    accessToken,
    phoneNumberId,
    apiVersion,
    templateName,
    templateLanguage:
      process.env.WHATSAPP_REMINDER_TEMPLATE_LANGUAGE ?? "pt_BR",
  }
}

const sendReminder = async ({
  config,
  phone,
  reminderLabel,
  serviceName,
  barbershopName,
  date,
}: {
  config: NonNullable<ReturnType<typeof getWhatsAppConfig>>
  phone: string
  reminderLabel: string
  serviceName: string
  barbershopName: string
  date: Date
}) => {
  const response = await fetch(
    `https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
          name: config.templateName,
          language: { code: config.templateLanguage },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: reminderLabel },
                { type: "text", text: serviceName },
                { type: "text", text: barbershopName },
                { type: "text", text: formatBusinessDate(date) },
                { type: "text", text: formatBusinessTime(date) },
              ],
            },
          ],
        },
      }),
      cache: "no-store",
    },
  )

  if (!response.ok) {
    throw new Error(`WhatsApp Cloud API returned HTTP ${response.status}.`)
  }
}

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    return NextResponse.json(
      { error: "CRON_SECRET is not configured." },
      { status: 503 },
    )
  }
  if (!isAuthorized(request, cronSecret)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  const whatsappConfig = getWhatsAppConfig()
  if (!whatsappConfig) {
    return NextResponse.json(
      { error: "WhatsApp Cloud API environment configuration is incomplete." },
      { status: 503 },
    )
  }

  const businessDate = getBusinessDate(new Date())
  const startOfDay = getDateTimeInBusinessTimeZone(businessDate, 0)
  const startOfNextDay = getDateTimeInBusinessTimeZone(
    new Date(
      Date.UTC(
        Number(businessDate.slice(0, 4)),
        Number(businessDate.slice(5, 7)) - 1,
        Number(businessDate.slice(8, 10)) + 1,
      ),
    )
      .toISOString()
      .slice(0, 10),
    0,
  )
  const now = new Date()
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000)
  const staleClaimBefore = new Date(now.getTime() - 60 * 60 * 1000)
  const reminderWindows = []

  if (getBusinessMinutesSinceMidnight(now) >= 8 * 60) {
    reminderWindows.push({
      date: { gte: startOfDay, lt: startOfNextDay, gt: now },
      whatsappReminderSentAt: null,
    })
  }
  reminderWindows.push({
    date: { gt: now, lte: oneHourFromNow },
    whatsappHourReminderSentAt: null,
  })

  const bookings = await db.booking.findMany({
    where: {
      status: "confirmed",
      whatsappPhone: { not: null },
      whatsappReminderConsentAt: { not: null },
      OR: reminderWindows,
    },
    include: {
      barbershopService: {
        include: { barbershop: { select: { name: true } } },
      },
    },
    orderBy: { date: "asc" },
  })

  let sent = 0
  let failed = 0

  for (const booking of bookings) {
    const dueReminders = []
    if (
      getBusinessMinutesSinceMidnight(now) >= 8 * 60 &&
      booking.date >= startOfDay &&
      booking.date < startOfNextDay &&
      !booking.whatsappReminderSentAt
    ) {
      dueReminders.push({
        label: "Lembrete das 8h",
        claimWhere: {
          whatsappReminderSentAt: null,
          OR: [
            { whatsappReminderClaimedAt: null },
            { whatsappReminderClaimedAt: { lt: staleClaimBefore } },
          ],
        },
        claimData: { whatsappReminderClaimedAt: new Date() },
        sentData: {
          whatsappReminderSentAt: new Date(),
          whatsappReminderClaimedAt: null,
        },
        releaseData: { whatsappReminderClaimedAt: null },
      })
    }
    if (
      booking.date > now &&
      booking.date <= oneHourFromNow &&
      !booking.whatsappHourReminderSentAt
    ) {
      dueReminders.push({
        label: "Lembrete de 1 hora",
        claimWhere: {
          whatsappHourReminderSentAt: null,
          OR: [
            { whatsappHourReminderClaimedAt: null },
            { whatsappHourReminderClaimedAt: { lt: staleClaimBefore } },
          ],
        },
        claimData: { whatsappHourReminderClaimedAt: new Date() },
        sentData: {
          whatsappHourReminderSentAt: new Date(),
          whatsappHourReminderClaimedAt: null,
        },
        releaseData: { whatsappHourReminderClaimedAt: null },
      })
    }

    if (!booking.whatsappPhone) {
      continue
    }

    for (const reminder of dueReminders) {
      const claim = await db.booking.updateMany({
        where: {
          id: booking.id,
          status: "confirmed",
          date: { gt: new Date() },
          ...reminder.claimWhere,
        },
        data: reminder.claimData,
      })
      if (claim.count === 0) {
        continue
      }

      try {
        await sendReminder({
          config: whatsappConfig,
          phone: booking.whatsappPhone,
          reminderLabel: reminder.label,
          serviceName: booking.barbershopService.name,
          barbershopName: booking.barbershopService.barbershop.name,
          date: booking.date,
        })
        await db.booking.update({
          where: { id: booking.id },
          data: reminder.sentData,
        })
        sent += 1
      } catch (error) {
        await db.booking.update({
          where: { id: booking.id },
          data: reminder.releaseData,
        })
        console.error("WhatsApp booking reminder failed.", {
          bookingId: booking.id,
          reminder: reminder.label,
          error: error instanceof Error ? error.message : "Unknown error",
        })
        failed += 1
      }
    }
  }

  return NextResponse.json(
    { date: businessDate, sent, failed },
    { status: failed > 0 ? 502 : 200 },
  )
}
