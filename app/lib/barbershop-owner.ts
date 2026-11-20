const ownerEmails = new Set([
  "manocatanduva@gmail.com",
  "wendelschineider17@gmail.com",
])

export const isBarbershopOwner = (email?: string | null) => {
  return ownerEmails.has(email?.trim().toLowerCase() ?? "")
}
