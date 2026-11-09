import { useMemo, useState } from "react"
import {
  CheckCircleIcon,
  MagnifyingGlassIcon,
  HeadsetIcon,
} from "@phosphor-icons/react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCallRecords, type CallRecord } from "@/lib/calls0800"
import { DefendersSectionHeader } from "@/pages/defenders/section-header"
import { Badge } from "@/components/ui/badge"

interface DefenderRecordsPageProps {
  onLogout: () => void
}

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("es-VE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
}

function recordSearchText(record: CallRecord) {
  return [
    record.id,
    record.callerName,
    record.phone,
    record.type,
    record.subtypes.join(" "),
    record.state,
    record.notes,
    ...Object.values(record.data).flat(),
  ]
    .join(" ")
    .toLocaleLowerCase()
}

export function DefenderRecordsPage({ onLogout }: DefenderRecordsPageProps) {
  const [records] = useState(() =>
    getCallRecords().filter((record) => record.redirectTo === "Defensoría"),
  )
  const [query, setQuery] = useState("")

  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    return records.filter(
      (record) =>
        !normalizedQuery || recordSearchText(record).includes(normalizedQuery),
    )
  }, [records, query])

  const attendedCount = records.filter((record) => record.defenderAttention).length
  const pendingCount = records.length - attendedCount

  return (
    <main className="min-h-svh ">
      <DefendersSectionHeader onLogout={onLogout} />
      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-7">
          <p className="text-sm font-medium text-sidebar-primary">Módulo de defensoras</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight  sm:text-3xl">
            Registros derivados a Defensoría
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Consulta los casos remitidos desde el 0800 y registra su atención.
          </p>
        </div>

        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <article className="rounded-2xl border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Casos derivados</p>
            <p className="mt-2 text-2xl font-semibold ">{records.length}</p>
          </article>
          <article className="rounded-2xl border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Pendientes de atención</p>
            <p className="mt-2 text-2xl font-semibold text-amber-700">{pendingCount}</p>
          </article>
          <article className="rounded-2xl border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Atendidos</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-700">{attendedCount}</p>
          </article>
        </div>

        <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="border-b p-4 sm:p-5">
            <label className="relative block max-w-xl">
              <MagnifyingGlassIcon
                size={18}
                className="absolute top-1/2 left-3 -translate-y-1/2"
                aria-hidden="true"
              />
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                placeholder="Buscar por código, persona, teléfono..."
                aria-label="Buscar registros derivados"
                className="h-10 bg-card pl-9"
              />
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-212.5 text-left text-sm">
              <thead className="bg-primary/10 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-5 py-3">Código / Fecha</th>
                  <th className="px-5 py-3">Tipo de llamada</th>
                  <th className="px-5 py-3">Persona / Teléfono</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3">Seguimiento</th>
                  <th className="px-5 py-3">Atendida</th>
                  <th className="px-5 py-3"><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-foreground">
                {filteredRecords.map((record) => {
                  const attended = Boolean(record.defenderAttention)
                  return (
                    <tr key={record.id} className="transition hover:bg-background">
                      {/* codigo y fecha */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-secondary-foreground">{record.id}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{formatDate(record.createdAt)}</p>
                      </td>
                      {/* tipo de llamada */}
                      <td className="px-5 py-4">
                        <Badge variant="secondary">{record.type}</Badge>
                        <p className="mt-2 max-w-56 truncate text-xs text-muted-foreground" title={record.subtypes.join(", ")}>
                          {record.subtypes.join(", ") || "Sin subtipo"}
                        </p>
                      </td>
                      {/* persona y telefono */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-sidebar-primary">{record.victimName}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{record.phone}</p>
                      </td>
                      {/* estado */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-sidebar-primary">{record.state}</p>
                      </td>
                      {/* seguimiento */}
                      <td className="px-5 py-4">
                        <Badge className="h-6" variant={record.followUp ? "warning" : "success"}>
                          {record.followUp ? "Pendiente" : "No requiere"}
                        </Badge>
                      </td>
                      {/* atendido por defensoría */}
                      <td className="px-5 py-4">
                        <Badge variant={attended ? "secondary" : "destructive"} >
                          {attended && <CheckCircleIcon size={14} weight="fill" aria-hidden="true" />}
                          {attended ? "Sí" : "No"}
                        </Badge>
                      </td>
                      {/* acciones */}
                      <td className="px-5 py-4 text-right">
                        <Button asChild variant="outline" size="sm" className="gap-1.5 rounded-lg">
                          <Link to={`/defensoras/registros/${encodeURIComponent(record.id)}`}>
                            <HeadsetIcon size={16} />
                            {attended ? "Ver atención" : "Atender"}
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  )
                })}
                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-14 text-center">
                      <p className="font-medium">
                        {records.length === 0
                          ? "No hay registros derivados a Defensoría"
                          : "No se encontraron registros"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {records.length === 0
                          ? "Los casos remitidos desde el 0800 aparecerán aquí."
                          : "Prueba con otros términos de búsqueda."}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t px-5 py-3 text-xs text-muted-foreground">
            Mostrando {filteredRecords.length} de {records.length} registros · Datos de prueba almacenados en este navegador
          </div>
        </section>
      </div>
    </main>
  )
}