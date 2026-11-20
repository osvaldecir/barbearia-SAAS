This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Acesso do proprietário

Qualquer conta Google pode fazer login. Somente `manocaatanduva@gmail.com` e `wendelschineider17@gmail.com` têm acesso à Gestão, em `/admin/agendamentos`, que exibe os agendamentos da barbearia Shinider.

Na área Gestão, o relatório mensal separa agendamentos previstos, pagamentos registrados e despesas lançadas. O proprietário pode registrar a forma e a data do recebimento, adicionar ou remover despesas e exportar o movimento do mês em CSV. O valor previsto usa o preço atual do serviço; o pagamento registrado guarda o valor do serviço no momento do registro. A migração `20261116180000_add_barbershop_accounting` deve ser aplicada antes de publicar a atualização (`npx prisma migrate deploy`).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Lembretes de agendamento pelo WhatsApp

Após o primeiro login com Google, o cliente informa o celular e pode autorizar
explicitamente lembretes pelo WhatsApp. A autorização é opcional; sem ela as
reservas não recebem mensagens. No plano Hobby, a Vercel chama
`/api/cron/whatsapp-reminders` diariamente às 08:00 (horário de São Paulo) para
enviar o lembrete do dia da reserva. O lembrete de uma hora antes não é garantido
com essa frequência; para executá-lo de forma confiável, é necessário configurar
o cron a cada minuto e usar o plano Pro da Vercel. O envio é feito apenas para
reservas confirmadas e com consentimento, com registros separados para evitar
repetição. Quem já estiver conectado sem celular será solicitado a completar o
cadastro antes de reservar.

Antes de ativar em produção:

1. Configure a WhatsApp Cloud API da Meta e crie/aprove um modelo de mensagem
   em português com o nome definido em `WHATSAPP_REMINDER_TEMPLATE_NAME`.
   O corpo do modelo deve ter cinco parâmetros, nesta ordem: tipo do lembrete,
   serviço, barbearia, data e horário. Exemplo: `{{1}}: seu serviço {{2}} na
{{3}} está marcado para {{4}}, às {{5}}.`
2. Configure estas variáveis no ambiente local e na Vercel:
   `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`,
   `WHATSAPP_API_VERSION` (versão Graph suportada pela Meta),
   `WHATSAPP_REMINDER_TEMPLATE_NAME`, `WHATSAPP_REMINDER_TEMPLATE_LANGUAGE`
   (padrão `pt_BR`) e `CRON_SECRET`.
3. Aplique as migrations do banco com `npx prisma migrate deploy` e gere o
   cliente Prisma com `npx prisma generate`.
4. Faça deploy na Vercel. Defina `CRON_SECRET` também nas variáveis do projeto
   Vercel para que o agendamento envie o cabeçalho de autorização.

No plano Hobby, o cron roda diariamente às 08:00 no horário de São Paulo.
Reservas sem consentimento explícito não recebem mensagem. Falhas de envio
aparecem nos logs da função e podem ser reprocessadas chamando a rota novamente
com o segredo.
