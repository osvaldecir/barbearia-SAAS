export const isBarbershopOwner = (email?: string | null) => {
  const ownerEmails = [
    process.env.BARBERSHOP_OWNER_EMAIL,
    "wendelschineider17@gmail.com",
  ]
    .flatMap((value) => value?.split(",") ?? [])
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)

  return ownerEmails.includes(email?.trim().toLowerCase() ?? "")
}
