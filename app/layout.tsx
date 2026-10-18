import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { Inter } from "next/font/google"
import { cn } from "@/app/lib/utils"
import Header from "@/components/header"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "FSW Barber | Encontre sua barbearia",
  description:
    "Encontre barbearias, conheça os espaços e acompanhe seus agendamentos com a FSW Barber.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={cn("font-sans", inter.variable)}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  )
}
