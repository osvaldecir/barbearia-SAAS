export const normalizeWhatsappPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "")

  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`
  }

  if (digits.length >= 12 && digits.length <= 15) {
    return digits
  }

  return null
}
