import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Termos de Uso | FSW Barber",
  description:
    "Consulte as condições de uso do site e dos agendamentos da FSW Barber.",
}

const TermsPage = () => (
  <main className="min-h-screen bg-[#080808] px-4 py-12 text-white sm:px-6">
    <article className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#f7e257]">
          FSW Barber
        </p>
        <h1 className="text-3xl font-bold sm:text-4xl">Termos de Uso</h1>
        <p className="text-sm text-zinc-400">Última atualização: 20/11/2026</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Uso do serviço</h2>
        <p className="leading-7 text-zinc-300">
          A FSW Barber permite consultar serviços e solicitar agendamentos
          mediante login com uma conta Google. Ao usar o site, você concorda em
          fornecer informações corretas, proteger o acesso à sua conta e usar o
          serviço de forma lícita.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Agendamentos</h2>
        <p className="leading-7 text-zinc-300">
          A disponibilidade, o serviço, a data e o horário são apresentados
          durante a reserva. Um agendamento só é confirmado quando aparecer
          como confirmado na sua conta. Você pode consultar e cancelar
          agendamentos disponíveis na área “Meus agendamentos”. A barbearia
          poderá entrar em contato para tratar de alterações necessárias.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Lembretes pelo WhatsApp</h2>
        <p className="leading-7 text-zinc-300">
          O fornecimento do celular é necessário para concluir o cadastro e
          reservar. Receber lembretes pelo WhatsApp é opcional: eles só são
          enviados se você autorizar, às 8h da manhã no dia do agendamento.
          Você pode continuar usando o serviço sem autorizar lembretes.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Disponibilidade e alterações</h2>
        <p className="leading-7 text-zinc-300">
          O site é fornecido pela internet e pode ficar temporariamente
          indisponível para manutenção ou por falhas de serviços necessários à
          sua operação. As informações de serviços e horários podem ser
          atualizadas; as condições da reserva confirmada são as exibidas no
          momento do agendamento.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Contato</h2>
        <p className="leading-7 text-zinc-300">
          Para dúvidas sobre estes termos, escreva para{" "}
          <a
            className="text-[#f7e257] underline underline-offset-4"
            href="mailto:manocatanduva@gmail.com"
          >
            manocatanduva@gmail.com
          </a>
          .
        </p>
      </section>
    </article>
  </main>
)

export default TermsPage
