"use client"

import { useSession } from "next-auth/react"
import { UserRound } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const UserGreeting = () => {
  const { data: session } = useSession()
  const name = session?.user?.name || "ClienteTester"
  const image = session?.user?.image

  return (
    <div className="flex items-center gap-3">
      <h1 className="max-w-2xl font-[family-name:var(--font-geist-sans)] text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
        Olá, <i>{name}</i>
      </h1>
      <Avatar
        role="img"
        aria-label={`Foto de ${name}`}
        className="h-11 w-11 border border-[#f7e257]/40 bg-[#1a1a1a] text-[#f7e257] sm:h-12 sm:w-12"
      >
        {image && <AvatarImage src={image} alt="" />}
        <AvatarFallback>
          <UserRound aria-hidden="true" className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>
    </div>
  )
}

export default UserGreeting
