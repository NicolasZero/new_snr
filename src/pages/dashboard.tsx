import {
  ArrowUpRightIcon,
  ClipboardTextIcon,
  GavelIcon,
  HeadsetIcon,
} from "@phosphor-icons/react"
import { Link } from "react-router"
import { AppHeader } from "@/components/layout/app-header"

interface DashboardPageProps {
  onLogout: () => void
}

const sections = [
  {
    title: "Registros",
    description: "Consulta y administra los registros del sistema.",
    icon: ClipboardTextIcon,
  },
  {
    title: "Atención 0800",
    description: "Accede a la información de llamadas y atención.",
    icon: HeadsetIcon,
    href: "/0800/registros",
  },
  {
    title: "Defensoras",
    description: "Consulta y atiende los casos derivados desde el 0800.",
    icon: GavelIcon,
    href: "/defensoras/registros",
  },
]

export function DashboardPage({ onLogout }: DashboardPageProps) {
  return (
    <main className="min-h-svh">
      <AppHeader onLogout={onLogout} showLogoutText />

      <div className="mx-auto max-w-7xl px-5 py-10">
        <section className="relative overflow-hidden rounded-3xl bg-primary px-6 py-9 sm:px-10 sm:py-12">
          <div className="absolute -top-32 -right-20 size-80 rounded-full border border-white/20" />
          <div className="absolute -top-20 -right-8 size-56 rounded-full border border-white/20" />
          <div className="relative max-w-2xl">
            <p className="mb-3 text-sm font-medium text-violet-200">
              Acceso autorizado
            </p>
            <h1 className="text-3xl leading-tight font-semibold tracking-tight text-white sm:text-4xl">
              Bienvenida/o al sistema
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-violet-100/80 sm:text-base">
              Desde aquí podrás acceder a las herramientas de registro y
              seguimiento de la plataforma.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-xl font-semibold">
              Módulos del sistema
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Selecciona una sección para comenzar.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {sections.map(({ title, description, icon: Icon, href }) => (
              <Link
                key={title}
                to={href ?? "/inicio"}
                className="group rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sidebar-primary hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-sidebar-primary/10 text-sidebar-primary">
                    <Icon size={23} weight="duotone" aria-hidden="true" />
                  </span>
                  <ArrowUpRightIcon
                    size={18}
                    className="text-violet-300 transition group-hover:text-sidebar-primary"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-5 text-base font-semibold ">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
                <span className={`mt-4 inline-flex rounded-full px-2.5 py-1 text-sm font-medium ${href ? "bg-sidebar-primary/10 text-sidebar-primary" : "bg-muted text-muted-foreground"}`}>
                  {href ? "Abrir módulo" : "Próximamente"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
