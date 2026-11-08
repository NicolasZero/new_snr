import { ClipboardTextIcon, SignOutIcon } from "@phosphor-icons/react"
import { Link, NavLink } from "react-router"
import { Button } from "@/components/ui/button"

interface SectionHeaderProps {
  onLogout: () => void
}

export function SectionHeader({ onLogout }: SectionHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link to="/inicio" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#172d55] text-white">
            <ClipboardTextIcon size={22} weight="duotone" />
          </span>
          <span>
            <span className="block text-sm font-semibold tracking-wide text-[#172d55]">
              SISTEMA NACIONAL DE REGISTRO
            </span>
            <span className="block text-xs text-slate-500">Módulo de atención 0800</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1" aria-label="Navegación 0800">
          <NavLink
            to="/0800/registrar"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? "bg-blue-50 text-[#172d55]" : "text-slate-600 hover:bg-slate-50"}`
            }
          >
            Registrar llamada
          </NavLink>
          <NavLink
            to="/0800/registros"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? "bg-blue-50 text-[#172d55]" : "text-slate-600 hover:bg-slate-50"}`
            }
          >
            Registros
          </NavLink>
          <Button
            type="button"
            variant="outline"
            onClick={onLogout}
            className="ml-1 size-10 rounded-xl border-slate-200 bg-white p-0 text-slate-600 hover:text-[#172d55]"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <SignOutIcon size={18} aria-hidden="true" />
          </Button>
        </nav>
      </div>
    </header>
  )
}
