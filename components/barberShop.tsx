type BarberShopProps = {
  barbershop: {
    name: string
  }
}

const BarberShop = ({ barbershop }: BarberShopProps) => {
  return <h1>{barbershop.name}</h1>
}

export default BarberShop
