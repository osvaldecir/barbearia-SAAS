export const isBarbershopOwner = (email?: string | null) => {
  const ownerEmail = process.env.BARBERSHOP_OWNER_EMAIL?.trim().toLowerCase()

  return Boolean(ownerEmail && email?.trim().toLowerCase() === ownerEmail)
}
