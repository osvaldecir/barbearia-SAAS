"use client"

import { SearchIcon } from "lucide-react"
import { useMemo, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type SearchableService = {
  id: string
  name: string
  barbershopId: string
}

type ServiceSearchProps = {
  services: SearchableService[]
}

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")

const ServiceSearch = ({ services }: ServiceSearchProps) => {
  const [query, setQuery] = useState("")
  const router = useRouter()
  const filteredServices = useMemo(() => {
    const normalizedQuery = normalize(query.trim())

    if (!normalizedQuery) {
      return []
    }

    return services.filter((service) =>
      normalize(service.name).includes(normalizedQuery),
    )
  }, [query, services])

  const getServiceHref = (service: SearchableService) =>
    `/barbershops/${service.barbershopId}?serviceId=${encodeURIComponent(service.id)}#service-${encodeURIComponent(service.id)}`

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const firstResult = filteredServices[0]

    if (firstResult) {
      router.push(getServiceHref(firstResult))
    }
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="relative z-20 flex w-full items-center gap-2 rounded-xl border border-white/10 bg-[#121212] p-2 shadow-lg shadow-black/20 transition focus-within:border-[#f7e257]/50 sm:max-w-sm"
    >
      <SearchIcon
        aria-hidden="true"
        className="ml-2 h-4 w-4 shrink-0 text-zinc-500"
      />
      <input
        type="search"
        aria-label="Buscar serviços"
        aria-autocomplete="list"
        aria-controls="service-search-results"
        aria-expanded={query.trim().length > 0}
        autoComplete="off"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar serviços..."
        className="h-10 min-w-0 flex-1 bg-transparent px-1 text-sm text-white outline-none placeholder:text-zinc-500"
      />
      <button
        type="submit"
        disabled={filteredServices.length === 0}
        className="rounded-lg bg-[#f7e257] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#ffec70] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Buscar
      </button>
      {query.trim().length > 0 && (
        <ul
          id="service-search-results"
          aria-label="Serviços encontrados"
          className="absolute left-0 right-0 top-full mt-2 max-h-64 overflow-y-auto rounded-xl border border-white/10 bg-[#121212] p-2 shadow-xl"
        >
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <li key={`${service.barbershopId}-${service.id}`}>
                <Link
                  href={getServiceHref(service)}
                  className="block rounded-lg px-3 py-2 text-sm text-zinc-200 transition hover:bg-[#f7e257]/10 hover:text-[#f7e257] focus-visible:bg-[#f7e257]/10 focus-visible:text-[#f7e257] focus-visible:outline-none"
                >
                  {service.name}
                </Link>
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-zinc-400">
              Nenhum serviço encontrado.
            </li>
          )}
        </ul>
      )}
    </form>
  )
}

export default ServiceSearch
