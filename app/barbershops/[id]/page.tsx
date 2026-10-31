import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { db } from "@/_lib/prisma";

type BarbershopPageProps = {
  params: {
    id: string;
  };
};

const BarbershopPage = async ({ params }: BarbershopPageProps) => {
  const barbershop = await db.barbershop.findUnique({
    where: { id: params.id },
  });

  if (!barbershop) {
    notFound();
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-start gap-4 px-5 py-12">
      <div className="w-full max-w-[351px]">
        <Link
          href="/"
          className="inline-flex items-center gap-3 rounded-lg px-5 py-3 text-lg font-semibold text-[#f7e257] transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257]"
        >
          <ArrowLeft aria-hidden="true" className="h-6 w-6" />
          Voltar
        </Link>
      </div>
      <Image
        src="/frente.png"
        alt={`Fachada da barbearia ${barbershop.name}`}
        width={351}
        height={393}
        priority
        className="h-auto w-auto max-w-full rounded-xl border-2 border-[#f7e257]"
      />
    </main>
  );
};

export default BarbershopPage;
