"use client";

import { useState } from "react";

const Home = () => {
  const [text] = useState("Bem-vindo ao Barber");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-950 text-white px-4 py-12">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          {text}
        </h1>
        <p className="mt-4 text-lg text-slate-300">
          Agende seu corte com estilo e aproveite um atendimento exclusivo.
        </p>
      </div>

      <button className="rounded-full bg-red-500 px-8 py-3 text-base font-semibold text-white transition hover:bg-red-600">
        Agendar agora
      </button>
    </main>
  );
};

export default Home;
