import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/lib/auth-options"
import { db } from "@/_lib/prisma"
import WhatsappProfileForm from "./whatsapp-profile-form"

type CompleteProfilePageProps = {
  searchParams?: {
    returnTo?: string | string[]
  }
}

const getSafeReturnTo = (value: string | string[] | undefined) => {
  const returnTo = Array.isArray(value) ? value[0] : value

  if (
    !returnTo ||
    !returnTo.startsWith("/") ||
    returnTo.startsWith("//") ||
    returnTo.startsWith("/complete-profile")
  ) {
    return "/"
  }

  return returnTo
}

export default async function CompleteProfilePage({
  searchParams,
}: CompleteProfilePageProps) {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email

  if (!email) {
    redirect("/")
  }

  const user = await db.user.findUnique({
    where: { email },
    select: { whatsappPhone: true },
  })
  const returnTo = getSafeReturnTo(searchParams?.returnTo)

  if (!user) {
    redirect("/")
  }
  if (user.whatsappPhone) {
    redirect(returnTo)
  }

  return <WhatsappProfileForm returnTo={returnTo} />
}
