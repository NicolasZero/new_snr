export type CallType =
  | "Orientación"
  | "Información"
  | "Intervención"
  | "No relevantes"

export type DefenderFollowUpService = "Psiquiatría" | "Ayuda ciudadana"

export interface DefenderAttention {
  summary: string
  needsFollowUp: boolean
  followUpService: DefenderFollowUpService | ""
  attendedAt: string
}

export interface CallRecord {
  id: string
  createdAt: string
  callerName: string
  phone: string
  type: CallType
  subtypes: string[]
  followUp: boolean
  redirectTo: string
  victimName: string
  state: string
  violenceTypes: string[]
  aggressorName: string
  notes: string
  data: Record<string, string | string[]>
  defenderAttention?: DefenderAttention
}

const STORAGE_KEY = "snr-0800-calls"
const callTypes: CallType[] = ["Orientación", "Información", "Intervención", "No relevantes"]

function isDefenderAttention(value: unknown): value is DefenderAttention {
  if (!value || typeof value !== "object") return false
  const attention = value as Record<string, unknown>
  return (
    typeof attention.summary === "string" &&
    typeof attention.needsFollowUp === "boolean" &&
    (attention.followUpService === "" ||
      attention.followUpService === "Psiquiatría" ||
      attention.followUpService === "Ayuda ciudadana") &&
    typeof attention.attendedAt === "string"
  )
}

function isCallRecord(value: unknown): value is CallRecord {
  if (!value || typeof value !== "object") return false
  const record = value as Record<string, unknown>
  return (
    typeof record.id === "string" &&
    typeof record.createdAt === "string" &&
    typeof record.callerName === "string" &&
    typeof record.phone === "string" &&
    typeof record.type === "string" &&
    callTypes.some((type) => type === record.type) &&
    Array.isArray(record.subtypes) &&
    record.subtypes.every((subtype) => typeof subtype === "string") &&
    typeof record.followUp === "boolean" &&
    typeof record.redirectTo === "string" &&
    typeof record.victimName === "string" &&
    typeof record.state === "string" &&
    Array.isArray(record.violenceTypes) &&
    typeof record.aggressorName === "string" &&
    typeof record.notes === "string" &&
    !!record.data &&
    typeof record.data === "object" &&
    !Array.isArray(record.data) &&
    (record.defenderAttention === undefined ||
      isDefenderAttention(record.defenderAttention))
  )
}

const demoRecords: CallRecord[] = [
  {
    id: "0800-2026-0042",
    createdAt: "2026-11-07T10:42:00",
    callerName: "María Fernanda Rojas",
    phone: "0412-555-0184",
    type: "Orientación",
    subtypes: ["Legal", "Situación (violencia contra la mujer)"],
    followUp: true,
    redirectTo: "Defensoría",
    victimName: "María Fernanda Rojas",
    state: "Distrito Capital",
    violenceTypes: ["Psicológica", "Amenaza"],
    aggressorName: "Dato reservado",
    notes: "Solicita orientación sobre opciones de protección.",
    data: {},
  },
  {
    id: "0800-2026-0041",
    createdAt: "2026-11-07T09:18:00",
    callerName: "Llamada no identificada",
    phone: "0424-555-0127",
    type: "Información",
    subtypes: ["Servicios del 0800"],
    followUp: false,
    redirectTo: "",
    victimName: "—",
    state: "—",
    violenceTypes: [],
    aggressorName: "—",
    notes: "Consulta de servicios disponibles.",
    data: {},
  },
  {
    id: "0800-2026-0040",
    createdAt: "2026-11-06T16:05:00",
    callerName: "Ana Carolina Pérez",
    phone: "0416-555-0169",
    type: "Intervención",
    subtypes: ["Preservación de la vida", "Ambulancia"],
    followUp: true,
    redirectTo: "Ayuda ciudadana",
    victimName: "Ana Carolina Pérez",
    state: "Miranda",
    violenceTypes: ["Física"],
    aggressorName: "No indicado",
    notes: "Se coordinó atención prioritaria.",
    data: {},
  },
  {
    id: "0800-2026-0039",
    createdAt: "2026-11-06T14:32:00",
    callerName: "Llamada no identificada",
    phone: "—",
    type: "No relevantes",
    subtypes: ["Llamada equivocada"],
    followUp: false,
    redirectTo: "",
    victimName: "—",
    state: "—",
    violenceTypes: [],
    aggressorName: "—",
    notes: "Llamada equivocada.",
    data: {},
  },
]

export function getCallRecords(): CallRecord[] {
  const savedRecords = window.localStorage.getItem(STORAGE_KEY)

  if (!savedRecords) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demoRecords))
    return demoRecords
  }

  try {
    const records: unknown = JSON.parse(savedRecords)
    if (!Array.isArray(records) || !records.every(isCallRecord)) {
      throw new Error("El formato de los registros guardados no es válido.")
    }
    return records
  } catch (error) {
    window.localStorage.removeItem(STORAGE_KEY)
    console.error("No se pudieron leer los registros 0800 guardados.", error)
    return demoRecords
  }
}

export function saveCallRecord(record: CallRecord): void {
  const records = getCallRecords()
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...records]))
}

export function saveDefenderAttention(
  recordId: string,
  attention: DefenderAttention,
): void {
  const records = getCallRecords()
  const recordIndex = records.findIndex((record) => record.id === recordId)

  if (recordIndex === -1) {
    throw new Error(`No se encontró el registro 0800 ${recordId}.`)
  }
  if (records[recordIndex].defenderAttention) {
    throw new Error(`El registro 0800 ${recordId} ya fue atendido por Defensoría.`)
  }
  if (records[recordIndex].redirectTo !== "Defensoría") {
    throw new Error(`El registro 0800 ${recordId} no fue derivado a Defensoría.`)
  }

  const updatedRecords = [...records]
  updatedRecords[recordIndex] = {
    ...updatedRecords[recordIndex],
    defenderAttention: attention,
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords))
}
