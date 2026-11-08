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
    <main className="min-h-svh bg-background">
      <AppHeader onLogout={onLogout} showLogoutText />

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <section className="relative overflow-hidden rounded-3xl bg-[#172d55] px-6 py-9 text-white sm:px-10 sm:py-12">
          <div className="absolute -top-32 -right-20 size-80 rounded-full border border-white/10" />
          <div className="absolute -top-20 -right-8 size-56 rounded-full border border-white/10" />
          <div className="relative max-w-2xl">
            <p className="mb-3 text-sm font-medium text-blue-200">
              Acceso autorizado
            </p>
            <h1 className="text-3xl leading-tight font-semibold tracking-tight text-white sm:text-4xl">
              Bienvenida/o al sistema
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-blue-100/80 sm:text-base">
              Desde aquí podrás acceder a las herramientas de registro y
              seguimiento de la plataforma.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-xl font-semibold ">
              Módulos del sistema
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Selecciona una sección para comenzar.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {sections.map(({ title, description, icon: Icon, href }) => (
              <Link
                key={title}
                to={href ?? "/inicio"}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-[#315d91]">
                    <Icon size={23} weight="duotone" aria-hidden="true" />
                  </span>
                  <ArrowUpRightIcon
                    size={18}
                    className="text-slate-300 transition group-hover:text-[#315d91]"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-5 text-base font-semibold text-slate-800">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {description}
                </p>
                <span className="mt-4 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-[#315d91]">
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
