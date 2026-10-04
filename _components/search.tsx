const Search = () => {
  return (
    <form className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm md:flex-row">
      <input
        aria-label="Buscar barbearia"
        className="h-12 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none ring-0 placeholder:text-muted-foreground"
        placeholder="Buscar por barbearia..."
      />
      <button
        type="submit"
        className="h-12 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
      >
        Buscar
      </button>
    </form>
  )
}

export default Search
