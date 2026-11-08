import { useState, type SubmitEvent } from "react"
import { useNavigate } from "react-router"
import {
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon,
  HeartIcon,
  LockKeyIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authenticate } from "@/lib/auth"

interface LoginPageProps {
  onAuthenticated: () => void
}

const currentYear = new Date().getFullYear()

export function LoginPage({ onAuthenticated }: LoginPageProps) {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const isAuthenticated = await authenticate(username.trim(), password)

      if (!isAuthenticated) {
        setError("Usuario o contraseña incorrectos. Inténtalo de nuevo.")
        return
      }

      onAuthenticated()
      navigate("/inicio", { replace: true })
    } catch {
      setError("No fue posible iniciar sesión. Inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-svh bg-[#f7f8fc] text-slate-900">
      <div className="grid min-h-svh lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-[#172d55] px-12 py-8 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
          <div className="absolute -left-36 -top-32 size-120 rounded-full border border-white/10" />
          <div className="absolute -left-16 -top-12 size-88 rounded-full border border-white/10" />
          <div className="absolute -bottom-48 -right-36 size-136 rounded-full bg-[#314c7b]/50 blur-3xl" />

          <div
            className="relative flex w-fit items-center gap-3 mb-3 text-white"
            aria-label="Sistema Nacional de Registro"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
              <ShieldCheckIcon size={25} weight="duotone" />
            </span>
            <span className="text-sm font-semibold tracking-wide">
              SISTEMA NACIONAL
              <span className="block text-xs font-medium tracking-[0.2em] text-blue-200">
                DE REGISTRO
              </span>
            </span>
          </div>

          <div className="relative max-w-xl pb-6">
            <div className="mb-7 flex size-14 items-center justify-center rounded-2xl bg-white/10 text-blue-100 ring-1 ring-white/15">
              <HeartIcon size={28} weight="duotone" />
            </div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-blue-200">
              Información que transforma
            </p>
            <h1 className="max-w-lg text-4xl leading-tight font-semibold tracking-tight text-white xl:text-5xl">
              Un espacio seguro para acompañar cada historia.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-blue-100/80">
              Una herramienta para organizar la información y fortalecer la
              atención de quienes más lo necesitan.
            </p>
            <div className="mt-10 flex items-center gap-3 text-sm text-blue-100/75">
              <span className="size-2 rounded-full bg-emerald-300" />
              Plataforma de uso institucional
            </div>
          </div>

          <p className="relative text-xs text-blue-100/60">
            © {currentYear} Sistema Nacional de Registro
          </p>
        </section>

        <section className="flex min-h-svh items-center justify-center px-5 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-105">
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <span className="flex size-11 items-center justify-center rounded-xl bg-[#172d55] text-white">
                <ShieldCheckIcon size={25} weight="duotone" />
              </span>
              <span className="text-sm font-semibold tracking-wide text-[#172d55]">
                SISTEMA NACIONAL
                <span className="block text-xs font-medium tracking-[0.2em] text-slate-500">
                  DE REGISTRO
                </span>
              </span>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold text-[#45699e]">
                Bienvenida/o
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Inicia sesión
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Ingresa tus credenciales institucionales para continuar.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-slate-700"
                >
                  Usuario
                </label>
                <div className="relative">
                  <UserIcon
                    size={19}
                    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <Input
                    id="username"
                    name="username"
                    autoComplete="username"
                    placeholder="Ingresa tu usuario"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="h-12 rounded-xl border-slate-200 bg-white pl-11 text-sm shadow-sm placeholder:text-slate-400 focus-visible:border-[#45699e] focus-visible:ring-[#45699e]/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <LockKeyIcon
                    size={19}
                    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-12 rounded-xl border-slate-200 bg-white pr-12 pl-11 text-sm shadow-sm placeholder:text-slate-400 focus-visible:border-[#45699e] focus-visible:ring-[#45699e]/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute top-1/2 right-3.5 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#45699e]"
                    aria-label={
                      showPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                  >
                    {showPassword ? <EyeSlashIcon size={19} /> : <EyeIcon size={19} />}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl bg-[#234878] text-sm font-semibold text-white shadow-sm transition hover:bg-[#1b3b65]"
              >
                {isSubmitting ? "Ingresando..." : "Ingresar"}
                {!isSubmitting && (
                  <ArrowRightIcon size={18} className="ml-1" aria-hidden="true" />
                )}
              </Button>
            </form>

            <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3.5">
              <p className="text-xs leading-5 text-slate-600">
                <span className="font-semibold text-[#234878]">
                  Acceso de demostración:
                </span>{" "}
                usuario <code className="font-semibold">admin</code> · contraseña{" "}
                <code className="font-semibold">admin</code>
              </p>
            </div>

            <p className="mt-8 text-center text-xs leading-5 text-slate-400">
              El acceso es de uso institucional. Si tienes problemas para
              ingresar, contacta con el equipo administrador.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}