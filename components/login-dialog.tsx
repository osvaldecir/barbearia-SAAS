"use client"

import { useState } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { LogOut } from "lucide-react"

const LoginDialog = () => {
  const { data: session } = useSession()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [signInError, setSignInError] = useState("")

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true)
    setSignInError("")

    try {
      await signIn("google", { callbackUrl: "/" })
    } catch {
      setSignInError("Não foi possível iniciar o login com Google. Tente novamente.")
      setIsSigningIn(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isSigningIn}
        aria-busy={isSigningIn}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-[#f7e257] bg-[#1f1f1f] px-3 text-sm font-medium text-[#f7e257] shadow-md shadow-black/30 transition hover:bg-[#f7e257]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257] disabled:cursor-wait disabled:opacity-60"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5 shrink-0"
        >
          <path fill="#4285F4" d="M3 6.8V18a1 1 0 0 0 1 1h3V10L3 6.8Z" />
          <path fill="#34A853" d="M17 10v9h3a1 1 0 0 0 1-1V6.8L17 10Z" />
          <path
            fill="#EA4335"
            d="M3 6.8 12 13l9-6.2-2.1-1.6a2 2 0 0 0-2.4 0L12 9.1 7.5 5.2a2 2 0 0 0-2.4 0L3 6.8Z"
          />
          <path fill="#FBBC04" d="M3 6.8 7 10v9H4a1 1 0 0 1-1-1V6.8Z" />
        </svg>
        {isSigningIn ? "Conectando..." : "Fazer login"}
      </button>
      {session?.user && (
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          aria-label="Sair da conta"
          title="Sair"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#f7e257] bg-[#1f1f1f] text-[#f7e257] shadow-md shadow-black/30 transition hover:bg-[#f7e257]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e257]"
        >
          <LogOut aria-hidden="true" className="h-4 w-4" />
        </button>
      )}
      {signInError && (
        <p
          role="alert"
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-red-500/30 bg-[#121212] px-4 py-3 text-sm text-red-400 shadow-xl"
        >
          {signInError}
        </p>
      )}
    </>
  )
}

export default LoginDialog
