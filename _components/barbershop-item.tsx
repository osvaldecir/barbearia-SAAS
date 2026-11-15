import { MapPin, MessageCircle, Smartphone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type BarbershopItemProps = {
  barbershop: {
    id: string
    name: string
    description?: string | null
    imageUrl?: string | null
    address: string
    phones: string
  }
}

const BarbershopItem = ({ barbershop }: BarbershopItemProps) => {
  const phoneDigits = barbershop.phones.replace(/\D/g, "")
  const whatsappPhone = phoneDigits.startsWith("55")
    ? phoneDigits
    : `55${phoneDigits}`

  return (
    <div className="space-y-3">
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#121212] shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-[#f7e257]/35 hover:shadow-xl hover:shadow-black/30">
        <div className="relative h-44 w-full overflow-hidden bg-[#1a1a1a]">
          <Image
            src={barbershop.imageUrl || "/logo2.png"}
            alt={
              barbershop.name.toLowerCase() === "shinider"
                ? "Interior da barbearia"
                : barbershop.name
            }
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 540px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
        </div>

        <div className="flex flex-1 flex-col p-4">
          {barbershop.name.toLowerCase() !== "shinider" && (
            <p className="line-clamp-3 min-h-[3.5rem] text-sm leading-5 text-zinc-500">
              {barbershop.description ||
                "Um espaço pensado para cuidar do seu visual e renovar o estilo."}
            </p>
          )}

          <div className="pt-4">
            {barbershop.name.toLowerCase() === "shinider" && (
              <Link
                href={`/barbershops/${barbershop.id}`}
                className="flex w-full items-center justify-center rounded-lg bg-[#f7e257] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#ffec70] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
              >
                Agendar
              </Link>
            )}
          </div>
        </div>
      </article>

      <div className="grid grid-cols-1 justify-items-center gap-y-3 px-4 text-sm text-zinc-400 sm:grid-cols-3 sm:gap-x-4">
        <p className="flex min-w-0 items-center gap-2 break-words">
          <MapPin
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 text-[#f7e257]"
          />
          <span>{barbershop.address}</span>
        </p>
        <a
          href={`tel:${phoneDigits}`}
          className="inline-flex items-center gap-2 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257]"
        >
          <Smartphone
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-[#f7e257]"
          />
          {barbershop.phones}
        </a>
        <a
          href={`https://wa.me/${whatsappPhone}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257]"
        >
          <MessageCircle
            aria-hidden="true"
            className="h-4 w-4 text-[#f7e257]"
          />
          WhatsApp
        </a>
      </div>
    </div>
  )
}

export default BarbershopItem
