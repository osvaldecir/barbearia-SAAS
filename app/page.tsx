"use client"

import { SearchIcon } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen bg-background px-4 py-6">
      <div className="flex flex-col gap-2 text-left">
        <h1 className="text-2xl font-bold italic">Olá, Val</h1>
        <p className="text-muted-foreground">Domingo, 04 de outubro de 2026</p>

        <div className="mt-4 flex items-center gap-2">
          <input
            placeholder="Favor faça sua busca..."
            className="w-full rounded-md border-[0.5px] border-[#f7e257] bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring focus-visible:ring-[#f7e257] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md bg-[#f7e257] p-2 text-primary-foreground"
            aria-label="Buscar"
          >
            <SearchIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  )
}
