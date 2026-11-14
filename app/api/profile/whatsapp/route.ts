import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/lib/auth-options"
import { normalizeWhatsappPhone } from "@/app/lib/whatsapp"
import { db } from "@/_lib/prisma"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email

  if (!email) {
    return NextResponse.json(
      { error: "Entre na sua conta para continuar." },
      {
        status: 401,
      },
    )
  }

  const body: unknown = await request.json()
  if (
    typeof body !== "object" ||
    body === null ||
    !("phone" in body) ||
    typeof body.phone !== "string" ||
    !("whatsappReminderOptIn" in body) ||
    typeof body.whatsappReminderOptIn !== "boolean"
  ) {
    return NextResponse.json(
      { error: "Informe um número de celular válido." },
      { status: 400 },
    )
  }

  const whatsappPhone = normalizeWhatsappPhone(body.phone)
  if (!whatsappPhone) {
    return NextResponse.json(
      {
        error:
          "Informe um número válido com DDD, incluindo o código do país se necessário.",
      },
      { status: 400 },
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

  const consentAt = body.whatsappReminderOptIn ? new Date() : null
  await db.user.update({
    where: { id: user.id },
    data: {
      whatsappPhone,
      whatsappReminderConsentAt: consentAt,
    },
  })

  if (consentAt) {
    await db.booking.updateMany({
      where: {
        userId: user.id,
        status: "confirmed",
        date: { gt: new Date() },
        whatsappReminderSentAt: null,
      },
      data: {
        whatsappPhone,
        whatsappReminderConsentAt: consentAt,
      },
    })
  }

  return NextResponse.json({ success: true })
}
