import { AppHeader } from "@/components/layout/app-header"

interface DefendersSectionHeaderProps {
  onLogout: () => void
}

const navItems = [{ label: "Registros", href: "/defensoras/registros" }]

export function DefendersSectionHeader({ onLogout }: DefendersSectionHeaderProps) {
  return (
    <AppHeader
      subtitle="Módulo de defensoras"
      navItems={navItems}
      navAriaLabel="Navegación de defensoras"
      onLogout={onLogout}
    />
  )
}
