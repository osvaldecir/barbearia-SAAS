import Image from "next/image"
import { MapPin } from "lucide-react"

type BarbershopItemProps = {
  barbershop: {
    id: string
    name: string
    address: string
    description?: string | null
    imageUrl?: string | null
  }
}

const BarbershopItem = ({ barbershop }: BarbershopItemProps) => {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#121212] shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-[#f7e257]/35 hover:shadow-xl hover:shadow-black/30">
      <div className="relative h-44 w-full overflow-hidden bg-[#1a1a1a]">
        <Image
          src={barbershop.imageUrl || "/logo2.png"}
          alt={barbershop.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 540px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-4 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          Barbearia
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-white">
            {barbershop.name}
          </h3>
          <p className="mt-1 flex items-start gap-1.5 text-sm leading-5 text-zinc-400">
            <MapPin
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-[#f7e257]"
            />
            <span className="line-clamp-2">{barbershop.address}</span>
          </p>
        </div>

        {barbershop.name.toLowerCase() !== "shinider" && (
          <p className="line-clamp-2 min-h-10 text-sm leading-5 text-zinc-500">
            {barbershop.description ||
              "Um espaço pensado para cuidar do seu visual e renovar o estilo."}
          </p>
        )}
      </div>
    </article>
  )
}

export default BarbershopItem
