import { useMemo, useState } from "react"
import {
  ArrowDownIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XIcon,
} from "@phosphor-icons/react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCallRecords, type CallRecord, type CallType } from "@/lib/calls0800"
import { SectionHeader } from "@/pages/0800/section-header"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface CallRecordsPageProps {
  onLogout: () => void
}

const types: CallType[] = ["Orientación", "Información", "Intervención", "No relevantes"]

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

export function CallRecordsPage({ onLogout }: CallRecordsPageProps) {
  const [records] = useState(getCallRecords)
  const [today] = useState(() => new Date().toDateString())
  const [query, setQuery] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<CallRecord | null>(null)

  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    return records.filter((record) => {
      return (
        (!selectedType || record.type === selectedType) &&
        (!normalizedQuery || recordSearchText(record).includes(normalizedQuery))
      )
    })
  }, [records, query, selectedType])

  const followUpCount = records.filter((record) => record.followUp).length
  const todayCount = records.filter(
    (record) => new Date(record.createdAt).toDateString() === today,
  ).length

  function exportCsv() {
    const rows = [
      ["Código", "Fecha", "Tipo", "Subtipo(s)", "Persona", "Teléfono", "Estado", "Seguimiento", "Redirigir a"],
      ...filteredRecords.map((record) => [
        record.id,
        formatDate(record.createdAt),
        record.type,
        record.subtypes.join(", "),
        record.victimName,
        record.phone,
        record.state,
        record.followUp ? "Sí" : "No",
        record.redirectTo,
      ]),
    ]
    const csv = rows
      .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(";"))
      .join("\r\n")
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }))
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = "registros-0800.csv"
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="min-h-svh ">
      <SectionHeader onLogout={onLogout} />
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-sidebar-primary">Módulo de atención 0800</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight  sm:text-3xl">
              Registros de llamadas
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Consulta y filtra las llamadas recibidas por las operadoras.
            </p>
          </div>
          <Button asChild className="h-10 gap-2 rounded-xl px-4 text-white">
            <Link to="/0800/registrar">
              <PlusIcon size={18} />
              Registrar llamada
            </Link>
          </Button>
        </div>

        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <article className="rounded-2xl border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Llamadas registradas</p>
            <p className="mt-2 text-2xl font-semibold ">{records.length}</p>
          </article>
          <article className="rounded-2xl border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Recibidas hoy</p>
            <p className="mt-2 text-2xl font-semibold ">{todayCount}</p>
          </article>
          <article className="rounded-2xl border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Requieren seguimiento</p>
            <p className="mt-2 text-2xl font-semibold ">{followUpCount}</p>
          </article>
        </div>

        <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <label className="relative block flex-1">
                <MagnifyingGlassIcon size={18} className="absolute top-1/2 left-3 -translate-y-1/2" aria-hidden="true" />
                <Input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                  placeholder="Buscar por código, persona, teléfono..."
                  aria-label="Buscar llamadas"
                  className="h-10 bg-card pl-9"
                />
              </label>
              <Select onValueChange={(value) => setSelectedType(value)}>
                <SelectTrigger className="w-45 h-10!">
                  <SelectValue placeholder="Filtrar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="">Todos</SelectItem>
                    {types.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}

                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Button type="button" variant="outline" onClick={exportCsv} className="h-10 gap-2 rounded-xl bg-card">
              <ArrowDownIcon size={17} />
              Exportar CSV
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-212.5 text-left text-sm">
              <thead className="bg-primary/10 text-xs font-semibold tracking-wide text-foreground uppercase">
                <tr>
                  <th className="px-5 py-3">Código / Fecha</th>
                  <th className="px-5 py-3">Tipo de llamada</th>
                  <th className="px-5 py-3">Persona / Teléfono</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3">Seguimiento</th>
                  <th className="px-5 py-3"><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-foreground">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="transition hover:bg-background">
                    {/* codigo y fecha */}
                    <td className="px-5 py-4">
                      <p className="text-secondary-foreground font-semibold">{record.id}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{formatDate(record.createdAt)}</p>
                    </td>
                    {/* tipo de llamada */}
                    <td className="px-5 py-4">
                      <Badge>{record.type}</Badge>
                      <p className="mt-2 max-w-56 truncate text-xs text-muted-foreground" title={record.subtypes.join(", ")}>
                        {record.subtypes.join(", ") || "Sin subtipo"}
                      </p>
                    </td>
                    {/* persona y telefono */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-primary">{record.victimName}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{record.phone}</p>
                    </td>
                    {/* estado */}
                    <td className="px-5 py-4 text-primary">{record.state}</td>
                    {/* seguimiento */}
                    <td className="px-5 py-4">
                      <Badge className="h-6" variant={record.followUp ? "warning" : "success"}>
                        {record.followUp ? "Pendiente" : "No requiere"}
                      </Badge>
                    </td>
                    {/* acciones */}
                    <td className="px-5 py-4 text-right">
                      <Button type="button" variant="outline" size="sm" onClick={() => setSelectedRecord(record)} className="gap-1.5 rounded-lg border-slate-200">
                        <EyeIcon size={16} />
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-14 text-center">
                      <p className="font-medium text-slate-700">No se encontraron llamadas</p>
                      <p className="mt-1 text-sm text-muted-foreground">Prueba con otros términos o cambia el filtro.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t px-5 py-3 text-xs text-muted-foreground">
            Mostrando {filteredRecords.length} de {records.length} llamadas · Datos de prueba almacenados en este navegador
          </div>
        </section>

        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" role="presentation" onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedRecord(null)
          }}>
            <section role="dialog" aria-modal="true" aria-labelledby="record-detail-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-card shadow-2xl">
              <div className="flex items-start justify-between border-b p-5 sm:p-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-sidebar-primary">Detalle de llamada</p>
                  <h2 id="record-detail-title" className="mt-1 text-xl font-semibold ">{selectedRecord.id}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{formatDate(selectedRecord.createdAt)}</p>
                </div>
                <Button type="button" variant="ghost" size="icon" aria-label="Cerrar detalle" onClick={() => setSelectedRecord(null)}>
                  <XIcon size={20} />
                </Button>
              </div>
              <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                <Detail label="Tipo de llamada" value={selectedRecord.type} />
                <Detail label="Subtipo(s)" value={selectedRecord.subtypes.join(", ") || "Sin subtipo"} />
                <Detail label="Persona agraviada" value={selectedRecord.victimName} />
                <Detail label="Teléfono" value={selectedRecord.phone} />
                <Detail label="Estado" value={selectedRecord.state} />
                <Detail label="Formas de violencia" value={selectedRecord.violenceTypes.join(", ") || "No indicado"} />
                <Detail label="Datos del agresor" value={selectedRecord.aggressorName} />
                <Detail label="Seguimiento" value={selectedRecord.followUp ? `Sí · ${selectedRecord.redirectTo}` : "No"} />
                <Detail label="Resumen de atención" value={selectedRecord.notes || "Sin observaciones"} className="sm:col-span-2" />
                {Object.entries(selectedRecord.data).map(([key, value]) => (
                  <Detail key={key} label={key} value={Array.isArray(value) ? value.join(", ") : value} />
                ))}
              </div>
              <div className="border-t p-5 text-right sm:px-6">
                <Button type="button" variant="outline" onClick={() => setSelectedRecord(null)}>Cerrar</Button>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  )
}

function Detail({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">{value}</p>
    </div>
  )
}