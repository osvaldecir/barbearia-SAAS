import "dotenv/config"
import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "../generated/prisma/client"

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL precisa estar definida para conectar ao banco.")
}

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString }),
})

async function seedDatabase() {
  try {
    const images = [
      "/imageFrente.jpeg",
      "https://utfs.io/f/45331760-899c-4b4b-910e-e00babb6ed81-16q.png",
    ]

    const creativeNames = ["shinider"]

    const addresses = ["rua pernambuco, 123"]

    const services = [
      {
        name: "Corte de Cabelo",
        description: "Estilo personalizado com as últimas tendências.",
        price: 60.0,
        duration: 45,
        imageUrl:
          "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
      },
      {
        name: "Barba",
        description: "Modelagem completa para destacar sua masculinidade.",
        price: 40.0,
        duration: 30,
        imageUrl:
          "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png",
      },
      {
        name: "Pézinho",
        description: "Acabamento perfeito para um visual renovado.",
        price: 35.0,
        duration: 20,
        imageUrl:
          "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      },
      {
        name: "Sobrancelha",
        description: "Expressão acentuada com modelagem precisa.",
        price: 20.0,
        duration: 15,
        imageUrl:
          "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png",
      },
      {
        name: "Massagem",
        description: "Relaxe com uma massagem revigorante.",
        price: 50.0,
        duration: 40,
        imageUrl:
          "https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png",
      },
      {
        name: "Hidratação",
        description: "Hidratação profunda para cabelo e barba.",
        price: 25.0,
        duration: 25,
        imageUrl:
          "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      },
      {
        name: "shinider",
        description: "excelencia em beleza masculina.",
        price: 25.0,
        duration: 25,
        imageUrl:
          "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      },
    ]

    const existingBarbershops = await prisma.barbershop.findMany({
      select: { id: true, name: true },
    })

    // Criar todas as barbearias e seus serviços associados em paralelo
    const barbershopPromises = creativeNames.map(async (name, i) => {
      const existingBarbershop = existingBarbershops.find(
        (shop) => shop.name === name,
      )

      if (existingBarbershop) {
        if (name === "shinider") {
          await prisma.barbershop.update({
            where: { id: existingBarbershop.id },
            data: { imageUrl: images[i] },
          })
        }

        const existingServices = await prisma.barbershopService.findMany({
          where: { barbershopId: existingBarbershop.id },
          select: { name: true },
        })
        const existingServiceNames = new Set(
          existingServices.map((service) => service.name),
        )
        const missingServices = services.filter(
          (service) => !existingServiceNames.has(service.name),
        )

        if (missingServices.length > 0) {
          await prisma.barbershopService.createMany({
            data: missingServices.map((service) => ({
              ...service,
              barbershopId: existingBarbershop.id,
            })),
          })
          console.log(`Serviços ausentes adicionados: ${name}`)
        } else {
          console.log(`Barbearia já possui os serviços: ${name}`)
        }
        return
      }

      await prisma.barbershop.create({
        data: {
          name,
          address: addresses[i],
          imageUrl: images[i],
          phones: "(11) 99999-9999",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac augue ullamcorper, pharetra orci mollis, auctor tellus. Phasellus pharetra erat ac libero efficitur tempus. Donec pretium convallis iaculis. Etiam eu felis sollicitudin, cursus mi vitae, iaculis magna. Nam non erat neque. In hac habitasse platea dictumst. Pellentesque molestie accumsan tellus id laoreet.",
          barbershopServices: {
            createMany: {
              data: services,
            },
          },
        },
      })
    })

    await Promise.all(barbershopPromises)
    console.log("Banco de dados populado com sucesso!")
  } catch (error) {
    console.error("Erro ao criar as barbearias:", error)
    throw error
  } finally {
    // Garante que o disconnect será chamado mesmo em caso de erro
    await prisma.$disconnect()
  }
}

seedDatabase().catch((error) => {
  console.error("Erro ao executar o seed:", error)
  process.exit(1)
})
