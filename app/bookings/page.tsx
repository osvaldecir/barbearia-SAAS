export default function BookingsPage() {
  return (
    <main className="min-h-screen bg-[#080808] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-xl shadow-black/30">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
          Agenda
        </p>
        <h1 className="text-3xl font-semibold text-white">Meus agendamentos</h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400">
          Acesse seu histórico e gerencie seus horários com facilidade.
        </p>
      </div>
    </main>
  )
}
