"use client";

import Image from "next/image";
import { useState } from "react";
import type { barbershopService } from "@/generated/prisma/client";

interface ServiceItemProps {
  service: barbershopService;
}

const ServiceItem = ({ service }: ServiceItemProps) => {
  const [selected, setSelected] = useState(false);
  const isHaircut = service.name.toLowerCase() === "corte de cabelo";

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => setSelected((isSelected) => !isSelected)}
      className={`h-full w-full space-y-2 rounded-xl border p-4 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257] ${
        selected
          ? "scale-[1.02] border-[#f7e257] bg-[#f7e257]/15 shadow-lg shadow-[#f7e257]/10"
          : "border-[#f7e257] bg-[#121212] hover:bg-[#f7e257]/5"
      }`}
    >
      <span className="flex items-center gap-3">
        {isHaircut && (
          <Image
            src="/service-cabelo.png"
            alt="Corte de cabelo"
            width={56}
            height={59}
            className="shrink-0 rounded-lg object-cover brightness-125 contrast-110 saturate-125"
          />
        )}
        <span className="min-w-0">
          <span className="block font-semibold text-white">{service.name}</span>
          <span className="mt-1 block text-sm text-zinc-400">
            {service.description}
          </span>
        </span>
      </span>
      <span className="flex items-center justify-between gap-3 pt-1">
        <span className="font-semibold text-[#f7e257]">
          {Number(service.price).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
        {service.duration != null && (
          <span className="text-sm text-zinc-500">{service.duration} min</span>
        )}
      </span>
    </button>
  );
};

export default ServiceItem;