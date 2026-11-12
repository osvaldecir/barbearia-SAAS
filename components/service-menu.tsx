"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef } from "react"

type ServiceMenuProps = {
  barbershopId: string | null
  services: {
    id: string
    name: string
  }[]
}

const ServiceMenu = ({ barbershopId, services }: ServiceMenuProps) => {
  const menuRef = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !menuRef.current?.contains(event.target)
      ) {
        menuRef.current?.removeAttribute("open")
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick)
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick)
  }, [])

  return (
    <details ref={menuRef} className="group relative">
      <summary
        aria-label="Abrir menu de serviços"
        className="flex h-10 w-10 list-none cursor-pointer items-center justify-center rounded-lg transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257] [&::-webkit-details-marker]:hidden"
      >
        <Image
          src="/burgue.png"
          alt=""
          aria-hidden="true"
          width={32}
          height={32}
          className="h-8 w-8"
        />
      </summary>
      <nav
        aria-label="Menu de serviços"
        className="absolute right-0 top-full z-20 mt-2 flex max-h-[min(70vh,32rem)] min-w-56 flex-col gap-1 overflow-y-auto rounded-xl border border-white/10 bg-[#121212] p-2 shadow-xl"
      >
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Serviços
        </p>
        {barbershopId && services.length ? (
          services.map((service) => (
            <Link
              key={service.id}
              href={`/barbershops/${barbershopId}?serviceId=${service.id}`}
              aria-label={`Agendar ${service.name}`}
              className="rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-[#f7e257]"
            >
              {service.name}
            </Link>
          ))
        ) : (
          <p className="px-3 py-2 text-sm text-zinc-500">
            Nenhum serviço disponível.
          </p>
        )}
        <Link
          href="#barbershops-heading"
          className="rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-[#f7e257]"
        >
          Barbearias
        </Link>
        <Link
          href="#booking-heading"
          className="rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-[#f7e257]"
        >
          Meus agendamentos
        </Link>
        {barbershopId && (
          <Link
            href={`/barbershops/${barbershopId}`}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-[#f7e257] transition hover:bg-white/5"
          >
            Ver todos e agendar
          </Link>
        )}
      </nav>
    </details>
  )
}

export default ServiceMenu
