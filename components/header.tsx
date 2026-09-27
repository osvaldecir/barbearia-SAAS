import Image from "next/image"

const Header = () => {
  return (
    <header className="py-4">
      <div className="flex items-center gap-2">
        <Image alt="fse-barver" src="/lobop.png" height={18} width={120} />
      </div>
    </header>
  )
}

export default Header
