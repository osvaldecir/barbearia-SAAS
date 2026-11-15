import { UserRound } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type UserGreetingProps = {
  name?: string | null
  image?: string | null
}

const UserGreeting = ({ name, image }: UserGreetingProps) => {
  const displayName = name || "ClienteTester"

  return (
    <div className="flex items-center gap-3">
      <h1 className="max-w-2xl font-[family-name:var(--font-geist-sans)] text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
        Olá, <i>{displayName}</i>
      </h1>
      <Avatar
        role="img"
        aria-label={`Foto de ${displayName}`}
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
