"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const Home = () => {
  const [label, setLabel] = useState("Teste")

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <div className="space-y-6 text-center">
        <h1 className="text-3xl font-bold">Bem-vindo ao Barber</h1>
        <p className="max-w-md text-slate-300">
          Clique no botão para ver o texto mudar.
        </p>
        <Button
          onClick={() => setLabel(label === "Teste" ? "Feito!" : "Teste")}
        >
          {label}
        </Button>
      </div>
    </main>
  )
}

export default Home
