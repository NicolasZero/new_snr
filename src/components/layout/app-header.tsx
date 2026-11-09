import { type ReactNode } from "react"
import { ClipboardTextIcon, SignOutIcon, type Icon } from "@phosphor-icons/react"
import { Link, NavLink } from "react-router"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/layout/mode-toggle"

export interface HeaderNavItem {
  label: string
  href: string
}

export interface AppHeaderProps {
  /**
   * Subtítulo o nombre de la sección/módulo (por defecto: "Panel institucional")
   */
  subtitle?: string
  /**
   * Ruta a la que apunta el logo/título principal (por defecto: "/inicio")
   */
  homeHref?: string
  /**
   * Ícono principal en el encabezado (por defecto: ClipboardTextIcon)
   */
  icon?: Icon
  /**
   * Lista opcional de enlaces de navegación interna del módulo
   */
  navItems?: HeaderNavItem[]
  /**
   * Elementos adicionales para la barra de navegación o acciones
   */
  children?: ReactNode
  /**
   * Etiqueta accesible para el elemento <nav>
   */
  navAriaLabel?: string
  /**
   * Manejador de evento al cerrar sesión
   */
  onLogout?: () => void
  /**
   * Muestra el texto "Cerrar sesión" en pantallas medianas/grandes.
   * Si es false, se muestra solo el ícono en un botón cuadrado.
   */
  showLogoutText?: boolean
  /**
   * Muestra el botón de alternar tema claro / oscuro (por defecto: true)
   */
  showThemeToggle?: boolean
  className?: string
}

export function AppHeader({
  subtitle = "Panel institucional",
  homeHref = "/inicio",
  icon: Icon = ClipboardTextIcon,
  navItems,
  children,
  navAriaLabel = "Navegación del módulo",
  onLogout,
  showLogoutText = false,
  showThemeToggle = true,
  className = "",
}: AppHeaderProps) {
  const hasNavContent = Boolean((navItems && navItems.length > 0) || children)

  return (
    <header className={`border-b border-border bg-card ${className}`}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link
          to={homeHref}
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
            <Icon size={22} weight="duotone" />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-wide text-foreground">
              SISTEMA NACIONAL DE REGISTRO
            </p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {hasNavContent && (
            <nav className="flex items-center gap-1" aria-label={navAriaLabel}>
              {navItems?.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                      ? "bg-background text-primary dark:text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              {children}
            </nav>
          )}

          {showThemeToggle && <ModeToggle />}

          {onLogout && (
            <Button
              type="button"
              variant="outline"
              onClick={onLogout}
              className={`rounded-xl border-border bg-background text-foreground hover:bg-muted ${showLogoutText
                ? "h-10 gap-2 px-3"
                : "size-10 p-0"
                }`}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <SignOutIcon size={18} aria-hidden="true" />
              {showLogoutText && (
                <span className="hidden sm:inline">Cerrar sesión</span>
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
