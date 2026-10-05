import Image from "next/image"

const Header = () => {
  return (
    <header className="border-b border-[#f7e257] bg-background backdrop-blur-sm">
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Image alt="fsW-barber" src="/capa.png" height={30} width={180} />
        </div>

        <button
          type="button"
          aria-label="Abrir menu"
          className="ml-auto shrink-0 translate-y-1 rounded-md p-1 text-[#f7e257]"
        >
          <Image
            alt="fsw"
            src="/burgue.png"
            height={28}
            width={42}
            className="h-[28px] w-[42px]"
            style={{
              filter:
                "brightness(0) saturate(100%) invert(93%) sepia(96%) saturate(1210%) hue-rotate(12deg) brightness(102%) contrast(100%)",
            }}
          />
        </button>
      </div>
    </header>
  )
}

export default Header
