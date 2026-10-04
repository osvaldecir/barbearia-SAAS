import Image from "next/image"

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
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative h-40 w-full">
        <Image
          src={barbershop.imageUrl || "/logo2.png"}
          alt={barbershop.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="space-y-2 p-4">
        <div>
          <h3 className="text-base font-semibold text-card-foreground">
            {barbershop.name}
          </h3>
          <p className="text-sm text-muted-foreground">{barbershop.address}</p>
        </div>

        <p className="text-sm text-muted-foreground">
          {barbershop.description || "Espaço premium para cortes, barbas e cuidados."}
        </p>
      </div>
    </div>
  )
}

export default BarbershopItem
