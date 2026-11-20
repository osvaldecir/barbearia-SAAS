import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Privacidade | FSW Barber",
  description:
    "Saiba como a FSW Barber usa e protege as informações da sua conta e dos seus agendamentos.",
}

const PrivacyPage = () => (
  <main className="min-h-screen bg-[#080808] px-4 py-12 text-white sm:px-6">
    <article className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#f7e257]">
          FSW Barber
        </p>
        <h1 className="text-3xl font-bold sm:text-4xl">
          Política de Privacidade
        </h1>
        <p className="text-sm text-zinc-400">Última atualização: 20/11/2026</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Informações que utilizamos</h2>
        <p className="leading-7 text-zinc-300">
          Ao entrar com o Google, recebemos os dados básicos do perfil
          autorizados por você, como nome, endereço de e-mail e, se
          disponibilizada, foto. Não recebemos sua senha do Google. Para
          agendar, também usamos o serviço escolhido, a data e o horário da
          reserva. Para concluir o cadastro, solicitamos seu número de celular.
        </p>
        <p className="leading-7 text-zinc-300">
          O número de WhatsApp é usado para lembretes somente se você der
          autorização expressa. Quando autorizados, os lembretes são enviados
          às 8h da manhã no dia do agendamento. Essa autorização é opcional e
          pode ser retirada pelo contato indicado nesta página. Registros de
          pagamento de agendamentos podem incluir valor, data e forma de
          pagamento; não coletamos dados de cartão por meio do app.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Como usamos os dados</h2>
        <p className="leading-7 text-zinc-300">
          Usamos as informações para autenticar sua conta, permitir e
          administrar reservas, apresentar seus agendamentos, responder a
          solicitações e, quando autorizado, enviar lembretes pelo WhatsApp.
          Também podemos usar registros técnicos necessários para proteger e
          manter o serviço.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Serviços de terceiros</h2>
        <p className="leading-7 text-zinc-300">
          O login é fornecido pelo Google. O app usa serviços de hospedagem e
          banco de dados para operar. Se você autorizar lembretes, o número e
          as informações necessárias sobre o agendamento serão enviados à
          plataforma WhatsApp da Meta para entregar a mensagem. Esses
          fornecedores tratam dados conforme suas próprias políticas.
        </p>
        <p className="leading-7 text-zinc-300">
          Não vendemos suas informações pessoais. O acesso é limitado ao
          necessário para operar o serviço e administrar os agendamentos.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Armazenamento e seus direitos</h2>
        <p className="leading-7 text-zinc-300">
          Mantemos os dados enquanto forem necessários para fornecer o serviço,
          administrar reservas e cumprir obrigações aplicáveis. Você pode
          solicitar acesso, correção ou exclusão dos seus dados, bem como
          retirar o consentimento para lembretes, sujeito às obrigações de
          retenção aplicáveis.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Contato</h2>
        <p className="leading-7 text-zinc-300">
          Para dúvidas ou solicitações sobre privacidade, escreva para{" "}
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

export default PrivacyPage
