import { SearchIcon } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <main className="min-h-screen bg-background py-6">
      <div className="px-4">
        <div className="flex flex-col gap-2 text-left">
          <h1 className="text-2xl font-bold italic">Olá, ClienteTester</h1>
          <p className="text-muted-foreground">Domingo, 04 de outubro de 2026</p>

          <form className="mt-4 flex items-center gap-2">
            <input
              type="search"
              aria-label="Buscar barbearias"
              placeholder="Favor faça sua busca..."
              className="w-full rounded-md border-[0.5px] border-[#f7e257] bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring focus-visible:ring-[#f7e257] focus-visible:ring-offset-2"
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center justify-center rounded-md bg-[#f7e257] p-2 text-primary-foreground"
              aria-label="Buscar"
            >
              <SearchIcon className="h-4 w-4" />
            </button>
          </form>
        </div>

        <Image
          src="/banner01.png"
          alt="FSW Barber"
          width={220}
          height={35}
          sizes="100vw"
          className="mt-2 h-auto w-full rounded-2xl"
        />
      </div>

      <section className="mt-6 px-4" aria-labelledby="booking-heading">
        <h2
          id="booking-heading"
          className="mb-3 text-sm font-bold uppercase tracking-wide text-white"
        >
          Agendamento
        </h2>
        <article className="rounded-xl border border-border bg-card px-4">
          <div className="flex flex-col gap-2 py-5">
            <Badge className="rounded-full bg-[#f7e257] text-black hover:bg-[#f7e257]">
              Confirmado
            </Badge>
          </div>
        </article>
      </section>
    </main>
  )
}
