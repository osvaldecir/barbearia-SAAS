import Image from "next/image"

const Header = () => {
  return (
    <header className="bg-background/80 border-b border-border backdrop-blur-sm">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3">

        <div className="flex items-center gap-2">
          <Image
            alt="fsW-barber"
            src="/lobop.png"
            height={18}
            width={120}
          />
        </div>

        <Image
          alt="fsw"
          src="/logo02.png"
          height={18}
          width={30}
        />

      </div>
    </header>
  )
}

export default Header