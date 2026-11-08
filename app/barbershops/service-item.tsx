"use client"

import Image from "next/image"
import { useState } from "react"
import type { barbershopService } from "@/generated/prisma/client"

interface ServiceItemProps {
  service: barbershopService
  phone: string
  initiallySelected?: boolean
}

const ServiceItem = ({
  service,
  phone,
  initiallySelected = false,
}: ServiceItemProps) => {
  const [selected, setSelected] = useState(initiallySelected)
  const isHaircut = service.name.toLowerCase() === "cabelo"
  const phoneDigits = phone.replace(/\D/g, "")
  const whatsappPhone = phoneDigits.startsWith("55")
    ? phoneDigits
    : `55${phoneDigits}`
  const reservationMessage = encodeURIComponent(
    `Olá! Gostaria de reservar o serviço ${service.name}.`,
  )
  const weekdayPrice =
    service.name === "Cabelo"
      ? 40
      : service.name === "Barba"
        ? 40
        : service.name === "Cabelo & Barba"
          ? 80
          : null
  const saturdayPrice =
    service.name === "Cabelo"
      ? 45
      : service.name === "Barba"
        ? 45
        : service.name === "Cabelo & Barba"
          ? 90
          : null

  return (
    <article
      id={`service-${service.id}`}
      className={`rounded-lg border-2 p-3 transition-all duration-200 ease-out ${
        selected
          ? "scale-[1.01] border-[#f7e257] bg-[#f7e257]/15 shadow-lg shadow-[#f7e257]/20 ring-1 ring-[#f7e257]/40"
          : "border-[#f7e257] bg-[#1f1f1f]"
      }`}
    >
      <button
        type="button"
        aria-pressed={selected}
        onClick={() => setSelected((isSelected) => !isSelected)}
        className="flex w-full items-center justify-between gap-4 rounded text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257]"
      >
        <span className="flex min-w-0 items-center gap-3">
          {isHaircut && (
            <Image
              src="/service-cabelo.png"
              alt=""
              aria-hidden="true"
              width={80}
              height={80}
              className="contrast-110 saturate-125 shrink-0 rounded-xl object-cover shadow-lg shadow-black/40 ring-2 ring-[#f7e257]/50 brightness-125"
            />
          )}
          <span className="min-w-0 space-y-1">
            <span className="block font-bold leading-tight text-white">
              {service.name}
            </span>
            <span className="block text-xs leading-snug text-zinc-300">
              {service.description}
            </span>
          </span>
        </span>
        <span className="shrink-0 text-right">
          {weekdayPrice !== null && saturdayPrice !== null ? (
            <span className="flex gap-3">
              <span>
                <span className="block text-[9px] font-semibold uppercase text-zinc-300">
                  Seg a qui
                </span>
                <span className="text-sm font-bold text-white">
                  {weekdayPrice.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </span>
              <span>
                <span className="block text-[9px] font-semibold uppercase text-zinc-300">
                  Qui a sáb
                </span>
                <span className="text-sm font-bold text-white">
                  {saturdayPrice.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </span>
            </span>
          ) : (
            <span className="text-base font-bold text-white">
              {Number(service.price).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          )}
          {service.duration != null && (
            <span className="mt-1 block text-xs text-zinc-400">
              {service.duration} min
            </span>
          )}
        </span>
      </button>
      <a
        href={`https://wa.me/${whatsappPhone}?text=${reservationMessage}`}
        target="_blank"
        rel="noreferrer"
        aria-label={`Reservar ${service.name} pelo WhatsApp`}
        className="mt-3 inline-flex items-center justify-center rounded-lg bg-[#f7e257] px-5 py-2.5 text-sm font-bold text-black transition hover:bg-[#ffec70] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1f1f1f]"
      >
        Reservar
      </a>
    </article>
  )
}

export default ServiceItem
