import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { db } from "@/_lib/prisma"
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

  return (
    <main className="flex min-h-screen w-full flex-col items-start gap-4 px-5 py-12">
      <div className="w-full max-w-[351px]">
        <Link
          href="/"
          className="inline-flex items-center gap-3 rounded-lg px-5 py-3 text-lg font-semibold text-[#f7e257] transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257]"
        >
          <ArrowLeft aria-hidden="true" className="h-6 w-6" />
          Voltar
        </Link>
      </div>
      <div className="flex w-full flex-col items-start gap-6">
        <section className="w-full flex-1 space-y-4">
          {barbershop.barbershopServices.length > 0 ? (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[...barbershop.barbershopServices]
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
                      phone={barbershop.phones}
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
      </div>
    </main>
  )
}

export default BarbershopPage
