import { AppHeader } from "@/components/layout/app-header"

interface SectionHeaderProps {
  onLogout: () => void
}

const navItems = [
  { label: "Registrar llamada", href: "/0800/registrar" },
  { label: "Registros", href: "/0800/registros" },
]

export function SectionHeader({ onLogout }: SectionHeaderProps) {
  return (
    <AppHeader
      subtitle="Módulo de atención 0800"
      navItems={navItems}
      navAriaLabel="Navegación 0800"
      onLogout={onLogout}
    />
  )
}
