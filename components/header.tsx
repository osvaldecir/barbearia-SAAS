import Image from "next/image"

const Header = () => {
  return (
    <header className="relative z-10 border-b border-[#f7e257] bg-black backdrop-blur-sm">
      <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Image
          src="/capa.png"
          alt="FSW Barber"
          width={400}
          height={150}
          priority
          className="h-auto w-[180px]"
        />
        <button
          type="button"
          aria-label="Abrir menu"
          className="shrink-0 rounded-md p-2 text-[#f7e257] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257]"
        >
          <span aria-hidden="true" className="flex w-[28px] flex-col gap-[5px]">
            <span className="h-[2px] w-full rounded bg-[#f7e257]" />
            <span className="h-[2px] w-full rounded bg-[#f7e257]" />
            <span className="h-[2px] w-full rounded bg-[#f7e257]" />
          </span>
        </button>
      </div>
    </header>
  )
}

export default Header
