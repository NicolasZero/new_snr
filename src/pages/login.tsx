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
import { useTheme } from "@/components/layout/theme-provider"


interface LoginPageProps {
  onAuthenticated: () => void
}

const currentYear = new Date().getFullYear()

export function LoginPage({ onAuthenticated }: LoginPageProps) {
  const { setTheme } = useTheme()
  setTheme("light")
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
    <main className="min-h-svh">
      <div className="grid min-h-svh lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-primary px-12 py-8 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
          <div className="absolute -left-36 -top-32 size-120 rounded-full border border-white/20" />
          <div className="absolute -left-16 -top-12 size-88 rounded-full border border-white/20" />
          <div className="absolute -bottom-48 -right-36 size-136 rounded-full bg-purple-600/50 blur-3xl" />

          <div
            className="relative flex w-fit items-center gap-3 mb-3"
            aria-label="Sistema Nacional de Registro"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
              <ShieldCheckIcon size={25} weight="duotone" />
            </span>
            <span className="text-sm font-semibold tracking-wide">
              SISTEMA NACIONAL
              <span className="block text-xs font-medium tracking-[0.2em] text-white/50">
                DE REGISTRO
              </span>
            </span>
          </div>

          <div className="relative max-w-xl pb-6">
            <div className="mb-7 flex size-14 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15">
              <HeartIcon size={28} weight="duotone" />
            </div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-muted">
              Información que transforma
            </p>
            <h1 className="max-w-lg text-4xl leading-tight font-semibold tracking-tight text-white xl:text-5xl">
              Un espacio seguro para acompañar cada historia.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-muted">
              Una herramienta para organizar la información y fortalecer la
              atención de quienes más lo necesitan.
            </p>
            <div className="mt-10 flex items-center gap-3 text-sm text-muted">
              <span className="size-2 rounded-full bg-emerald-400" />
              Plataforma de uso institucional
            </div>
          </div>

          <p className="relative text-xs text-muted">
            © {currentYear} Sistema Nacional de Registro
          </p>
        </section>

        <section className="flex min-h-svh items-center justify-center px-5 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-105">
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-white">
                <ShieldCheckIcon size={25} weight="duotone" />
              </span>
              <span className="text-sm font-semibold tracking-wide text-primary">
                SISTEMA NACIONAL
                <span className="block text-xs font-medium tracking-[0.2em] text-muted-foreground">
                  DE REGISTRO
                </span>
              </span>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold text-violet-400">
                Bienvenida/o
              </p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Inicia sesión
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Ingresa tus credenciales institucionales para continuar.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-violet-700"
                >
                  Usuario
                </label>
                <div className="relative">
                  <UserIcon
                    size={19}
                    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-violet-400"
                    aria-hidden="true"
                  />
                  <Input
                    id="username"
                    name="username"
                    autoComplete="username"
                    placeholder="Ingresa tu usuario"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="h-12 rounded-xl border-slate-200 bg-white pl-11 text-sm shadow-sm placeholder:text-violet-400 focus-visible:border-violet-400 focus-visible:ring-violet-400/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-violet-700"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <LockKeyIcon
                    size={19}
                    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-violet-400"
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
                    className="h-12 rounded-xl border-slate-200 bg-white pr-12 pl-11 text-sm shadow-sm placeholder:text-violet-400 focus-visible:border-violet-400 focus-visible:ring-violet-400/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute top-1/2 right-3.5 -translate-y-1/2 rounded-md p-1 text-violet-400 transition hover:text-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
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
                // variant="primary"
                className="h-12 w-full rounded-xl text-sm font-semibold text-white shadow-sm transition"
              >
                {isSubmitting ? "Ingresando..." : "Ingresar"}
                {!isSubmitting && (
                  <ArrowRightIcon size={18} className="ml-1" aria-hidden="true" />
                )}
              </Button>
            </form>

            <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3.5">
              <p className="text-xs leading-5 text-slate-600">
                <span className="font-semibold text-slate-900">
                  Acceso de demostración:
                </span>{" "}
                usuario <code className="font-semibold">admin</code> · contraseña{" "}
                <code className="font-semibold">admin</code>
              </p>
            </div>

            <p className="mt-8 text-center text-xs leading-5 text-violet-500">
              El acceso es de uso institucional. Si tienes problemas para
              ingresar, contacta con el equipo administrador.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}