import { useState, type SubmitEvent } from "react"
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  FloppyDiskIcon,
} from "@phosphor-icons/react"
import { Link, useParams } from "react-router"
import { Button } from "@/components/ui/button"
import {
  getCallRecords,
  saveDefenderAttention,
  type CallRecord,
  type DefenderAttention,
  type DefenderFollowUpService,
} from "@/lib/calls0800"
import { DefendersSectionHeader } from "@/pages/defenders/section-header"

interface DefenderRegisterPageProps {
  onLogout: () => void
}

const followUpServices: DefenderFollowUpService[] = ["Psiquiatría", "Ayuda ciudadana"]

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("es-VE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
}

function Detail({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">{value}</p>
    </div>
  )
}

function recordDetails(record: CallRecord) {
  return [
    { label: "Tipo de llamada", value: record.type },
    { label: "Subtipo(s)", value: record.subtypes.join(", ") || "Sin subtipo" },
    { label: "Persona agraviada", value: record.victimName },
    { label: "Teléfono", value: record.phone },
    { label: "Estado", value: record.state },
    { label: "Formas de violencia", value: record.violenceTypes.join(", ") || "No indicado" },
    { label: "Datos del agresor", value: record.aggressorName },
    { label: "Seguimiento solicitado en 0800", value: record.followUp ? `Sí · ${record.redirectTo}` : "No" },
    { label: "Resumen de llamada", value: record.notes || "Sin observaciones", className: "sm:col-span-2" },
    ...Object.entries(record.data).map(([label, value]) => ({
      label,
      value: Array.isArray(value) ? value.join(", ") : value,
    })),
  ]
}

export function DefenderRegisterPage({ onLogout }: DefenderRegisterPageProps) {
  const { recordId } = useParams()
  const [record, setRecord] = useState(() =>
    getCallRecords().find((item) => item.id === recordId),
  )
  const [needsFollowUp, setNeedsFollowUp] = useState("")
  const [followUpService, setFollowUpService] = useState<DefenderFollowUpService | "">("")
  const [saveError, setSaveError] = useState("")

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!record || record.defenderAttention) return

    const formData = new FormData(event.currentTarget)
    const summary = String(formData.get("summary") || "").trim()
    const needsFollowUpValue = needsFollowUp === "Sí"
    const service = needsFollowUpValue ? followUpService : ""

    if (!summary || !needsFollowUp || (needsFollowUpValue && !service)) {
      setSaveError("Completa el resumen y las opciones de seguimiento requeridas.")
      return
    }

    const attention: DefenderAttention = {
        summary,
        needsFollowUp: needsFollowUpValue,
        followUpService: service,
        attendedAt: new Date().toISOString(),
      }

    try {
      saveDefenderAttention(record.id, attention)
      setSaveError("")
      setRecord({ ...record, defenderAttention: attention })
    } catch (error) {
      console.error("No se pudo guardar la atención de Defensoría.", error)
      setSaveError("No fue posible guardar la atención en este navegador. Intenta nuevamente.")
    }
  }

  return (
    <main className="min-h-svh bg-[#f7f8fc] text-slate-900">
      <DefendersSectionHeader onLogout={onLogout} />
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
        <Button asChild type="button" variant="ghost" className="mb-5 -ml-3 gap-2 text-slate-600">
          <Link to="/defensoras/registros">
            <ArrowLeftIcon size={17} />
            Volver a registros
          </Link>
        </Button>

        {!record || record.redirectTo !== "Defensoría" ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-semibold text-slate-900">Registro no disponible</h1>
            <p className="mt-2 text-sm text-slate-500">
              No se encontró el registro o no fue derivado a Defensoría.
            </p>
            <Button asChild className="mt-5 rounded-xl bg-[#172d55] text-white hover:bg-[#243f70]">
              <Link to="/defensoras/registros">Ir a los registros</Link>
            </Button>
          </section>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm font-medium text-[#315d91]">Atención de Defensoría</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Registro {record.id}
              </h1>
              <p className="mt-2 text-sm text-slate-500">{formatDate(record.createdAt)}</p>
            </div>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <h2 className="font-semibold text-slate-900">Datos del registro 0800</h2>
              </div>
              <div className="grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2 sm:p-6">
                {recordDetails(record).map((detail) => (
                  <Detail key={detail.label} {...detail} />
                ))}
              </div>
            </section>

            <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <h2 className="font-semibold text-slate-900">Atención de Defensoría</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Registra el resumen de atención y si el caso necesita seguimiento.
                </p>
              </div>

              {record.defenderAttention ? (
                <div className="p-5 sm:p-6">
                  <div role="status" className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                    <CheckCircleIcon size={19} weight="fill" aria-hidden="true" />
                    Atención registrada por Defensoría
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Detail
                      label="Resumen de la atención"
                      value={record.defenderAttention.summary}
                      className="sm:col-span-2"
                    />
                    <Detail
                      label="El caso necesita seguimiento"
                      value={record.defenderAttention.needsFollowUp ? "Sí" : "No"}
                    />
                    {record.defenderAttention.needsFollowUp && (
                      <Detail
                        label="Derivación de seguimiento"
                        value={record.defenderAttention.followUpService}
                      />
                    )}
                    <Detail
                      label="Fecha de atención"
                      value={formatDate(record.defenderAttention.attendedAt)}
                    />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-5 p-5 sm:p-6">
                  <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                    Resumen de la atención
                    <textarea
                      name="summary"
                      rows={4}
                      required
                      maxLength={2000}
                      placeholder="Describe brevemente la atención brindada..."
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-blue-400 focus:ring-3 focus:ring-blue-100"
                    />
                  </label>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                      El caso necesita seguimiento
                      <select
                        value={needsFollowUp}
                        onChange={(event) => {
                          setNeedsFollowUp(event.currentTarget.value)
                          if (event.currentTarget.value !== "Sí") setFollowUpService("")
                        }}
                        required
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-blue-400 focus:ring-3 focus:ring-blue-100"
                      >
                        <option value="">Seleccionar</option>
                        <option value="Sí">Sí</option>
                        <option value="No">No</option>
                      </select>
                    </label>
                    {needsFollowUp === "Sí" && (
                      <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                        Tipo de seguimiento
                        <select
                          value={followUpService}
                          onChange={(event) => {
                            const selectedService = followUpServices.find(
                              (service) => service === event.currentTarget.value,
                            )
                            setFollowUpService(selectedService ?? "")
                          }}
                          required
                          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-blue-400 focus:ring-3 focus:ring-blue-100"
                        >
                          <option value="">Seleccionar</option>
                          {followUpServices.map((service) => (
                            <option key={service} value={service}>{service}</option>
                          ))}
                        </select>
                      </label>
                    )}
                  </div>
                  {saveError && (
                    <p role="alert" className="text-sm text-red-700">{saveError}</p>
                  )}
                  <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
                    <Button asChild type="button" variant="outline" className="rounded-xl">
                      <Link to="/defensoras/registros">Cancelar</Link>
                    </Button>
                    <Button type="submit" className="gap-2 rounded-xl bg-[#172d55] text-white hover:bg-[#243f70]">
                      <FloppyDiskIcon size={17} />
                      Guardar atención
                    </Button>
                  </div>
                </form>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  )
}