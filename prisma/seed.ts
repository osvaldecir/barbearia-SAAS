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
    const images = ["/imageFrente.jpeg"]

    const creativeNames = ["shinider"]

    const addresses = ["rua pernambuco, 123"]

    const services = [
      {
        name: "Cabelo",
        description: "Corte, estilo e acabamento premium.",
        price: 40,
        duration: 40,
        imageUrl: "/service-cabelo.png",
      },
      {
        name: "Barba",
        description: "Modelagem completa para um visual alinhado.",
        price: 40,
        duration: 30,
        imageUrl: "/logo2.png",
      },
      {
        name: "Cabelo & Barba",
        description: "Experiência completa. Cabelo e barba alinhados.",
        price: 80,
        duration: 60,
        imageUrl: "/logo2.png",
      },
      {
        name: "Acabamento",
        description: "Detalhes que fazem toda a diferença.",
        price: 25,
        duration: 25,
        imageUrl: "/logo2.png",
      },
      {
        name: "Bigode ou Sobrancelha",
        description: "Design e simetria para realçar seu estilo.",
        price: 15,
        duration: 15,
        imageUrl: "/logo2.png",
      },
      {
        name: "Hidratação",
        description: "Reposição de nutrientes, fios mais saudáveis.",
        price: 35,
        duration: 25,
        imageUrl: "/logo2.png",
      },
      {
        name: "Pigmentação",
        description: "Cobertura de fios brancos com efeito natural.",
        price: 50,
        duration: 25,
        imageUrl: "/logo2.png",
      },
      {
        name: "Progressiva",
        description:
          "Alinhamento capilar masculino. Reduz o volume, controla o frizz e alinha os fios, respeitando a estrutura do seu cabelo.",
        price: 180,
        duration: 25,
        imageUrl: "/logo2.png",
      },
      {
        name: "Luzes & Corte",
        description: "Iluminação estratégica para realçar seu estilo.",
        price: 150,
        duration: 120,
        imageUrl: "/logo2.png",
      },
      {
        name: "Platinado e corte",
        description:
          "Descoloração completa com técnica profissional e acabamento impecável.",
        price: 200,
        duration: 180,
        imageUrl: "/logo2.png",
      },
      {
        name: "Barba Project",
        description:
          "Tratamento para corrigir falhas e estimular o crescimento dos fios. Mais preenchimento, volume e definição para sua barba.",
        price: 250,
        duration: 30,
        imageUrl: "/logo2.png",
      },
      {
        name: "Prótese Capilar",
        description:
          "Solução personalizada para recuperação capilar. Naturalidade, conforto e autoestima renovada.",
        price: 2500,
        duration: 120,
        imageUrl: "/logo2.png",
      },
      {
        name: "Skincare",
        description: "Limpeza de pele profunda e renovação.",
        price: 35,
        duration: 25,
        imageUrl: "/logo2.png",
      },
      {
        name: "Depilação a cera",
        description: "Mais conforto e higiene para o dia a dia.",
        price: 25,
        duration: 25,
        imageUrl: "/logo2.png",
      },
      {
        name: "Alisamento",
        description:
          "Deixa os fios mais lisos, controlando o volume e eliminando o frizz, proporcionando um aspecto mais alinhado, brilhoso e saudável. Ideal para quem busca praticidade no dia a dia e um visual mais disciplinado, sem perder o movimento natural.",
        price: 100,
        duration: 60,
        imageUrl: "/logo2.png",
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
        const existingServices = await prisma.barbershopService.findMany({
          where: { barbershopId: existingBarbershop.id },
          select: { id: true, name: true },
        })

        for (const service of services) {
          const existingService = existingServices.find(
            (item) => item.name.toLowerCase() === service.name.toLowerCase(),
          )

          if (existingService) {
            await prisma.barbershopService.update({
              where: { id: existingService.id },
              data: service,
            })
          } else {
            await prisma.barbershopService.create({
              data: {
                ...service,
                barbershopId: existingBarbershop.id,
              },
            })
          }
        }

        console.log(`Serviços atualizados: ${name}`)
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
