import { notFound } from "next/navigation"
import { db } from "@/_lib/prisma"
import BackButton from "../back-button"
import ServiceItem from "../service-item"

const serviceOrder = [
  "Cabelo",
  "Barba",
  "Cabelo & Barba",
  "Acabamento",
  "Bigode ou Sobrancelha",
  "Hidratação",
  "Pigmentação",
  "Progressiva",
  "Luzes & Corte",
  "Platinado e corte",
  "Barba Project",
  "Prótese Capilar",
  "Skincare",
  "Depilação a cera",
  "Alisamento",
]

type BarbershopPageProps = {
  params: {
    id: string
  }
  searchParams?: {
    serviceId?: string | string[]
  }
}

const BarbershopPage = async ({
  params,
  searchParams,
}: BarbershopPageProps) => {
  const selectedServiceId = Array.isArray(searchParams?.serviceId)
    ? searchParams.serviceId[0]
    : searchParams?.serviceId
  const barbershop = await db.barbershop.findUnique({
    where: { id: params.id },
    include: {
      barbershopServices: true,
    },
  })

  if (!barbershop) {
    notFound()
  }

  const visibleServices = barbershop.barbershopServices.filter(
    (service) => service.name.trim().toLowerCase() !== "shinider",
  )

  return (
    <main className="flex min-h-screen w-full flex-col items-start gap-4 px-5 py-12">
      <div className="flex w-full flex-col items-start gap-6">
        <section className="w-full flex-1 space-y-4">
          {visibleServices.length > 0 ? (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[...visibleServices]
                .sort((a, b) => {
                  const aOrder = serviceOrder.indexOf(a.name)
                  const bOrder = serviceOrder.indexOf(b.name)
                  return (
                    (aOrder === -1 ? serviceOrder.length : aOrder) -
                    (bOrder === -1 ? serviceOrder.length : bOrder)
                  )
                })
                .map((service) => (
                  <li key={service.id}>
                    <ServiceItem
                      service={service}
                      initiallySelected={service.id === selectedServiceId}
                    />
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-400">
              Esta barbearia ainda não cadastrou serviços.
            </p>
          )}
        </section>
        <div className="w-full pt-2">
          <BackButton />
        </div>
      </div>
    </main>
  )
}

export default BarbershopPage
