import { useState, type ReactNode, type SubmitEvent } from "react"
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ClipboardTextIcon,
  FloppyDiskIcon,
  PlusCircleIcon,
} from "@phosphor-icons/react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  saveCallRecord,
  type CallRecord,
  type CallType,
} from "@/lib/calls0800"
import { SectionHeader } from "@/pages/0800/section-header"

interface RegisterCallPageProps {
  onLogout: () => void
}

const callTypes: CallType[] = [
  "Orientación",
  "Información",
  "Intervención",
  "No relevantes",
]

const subtypeOptions: Record<CallType, string[]> = {
  Orientación: [
    "Pasos a seguir para la solución de problemas (VCM)",
    "Aclaración de errores",
    "Mitos y creencias",
    "Legal",
    "Situación (violencia contra la mujer)",
    "Salud",
    "APP (contención emocional)",
  ],
  Información: [
    "Servicios del 0800",
    "Referencias simples",
    "Puntos de encuentro",
    "Eventos",
    "Misiones",
    "Contactos institucionales",
  ],
  Intervención: [
    "Protección física",
    "Preservación de la vida",
    "Protección legal",
    "Casa de abrigo",
    "Instituciones",
    "Ambulancia",
    "Bomberos",
  ],
  "No relevantes": [
    "Violencia simulada",
    "Agresión verbal (contra el operador)",
    "Niños",
    "Sin audio",
    "Llamada caída",
    "Llamada equivocada",
    "Ociosa",
  ],
}

const violenceOptions = [
  "Psicológica",
  "Acoso u hostigamiento",
  "Amenaza",
  "Física",
  "Doméstica",
  "Sexual",
  "Acceso carnal violento",
  "Prostitución forzada",
  "Esclavitud sexual",
  "Acoso sexual",
  "Laboral",
  "Patrimonial y económica",
  "Obstetricia",
  "Esterilización forzada",
  "Mediática",
  "Institucional",
  "Simbólica",
  "Tráfico de mujeres y niños",
  "Trata de mujeres y niños",
  "Femicidio",
]

const states = [
  "Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas", "Bolívar",
  "Carabobo", "Cojedes", "Delta Amacuro", "Distrito Capital", "Falcón",
  "Guárico", "La Guaira", "Lara", "Mérida", "Miranda", "Monagas",
  "Nueva Esparta", "Portuguesa", "Sucre", "Táchira", "Trujillo",
  "Yaracuy", "Zulia",
]

function Field({
  label,
  children,
  className = "",
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={`grid gap-1.5 text-sm font-medium text-slate-700 ${className}`}>
      {label}
      {children}
    </label>
  )
}

function Select({
  name,
  options,
}: {
  name: string
  options: string[]
}) {
  return (
    <select
      name={name}
      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal text-slate-700 outline-none focus:border-blue-400 focus:ring-3 focus:ring-blue-100"
    >
      <option value="">Seleccionar</option>
      {options.map((option) => <option key={option}>{option}</option>)}
    </select>
  )
}

function CheckOptions({
  name,
  options,
  columns = "sm:grid-cols-2 lg:grid-cols-3",
}: {
  name: string
  options: string[]
  columns?: string
}) {
  return (
    <div className={`grid gap-2 ${columns}`}>
      {options.map((option) => (
        <label
          key={option}
          className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2.5 text-sm text-slate-600"
        >
          <input type="checkbox" name={name} value={option} className="mt-0.5 size-4 accent-[#315d91]" />
          {option}
        </label>
      ))}
    </div>
  )
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-5 border-b border-slate-100 pb-4">
        <h2 className="font-semibold text-slate-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {children}
    </section>
  )
}

export function RegisterCallPage({ onLogout }: RegisterCallPageProps) {
  const [callDateTime] = useState(() =>
    new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
  )
  const [callType, setCallType] = useState<CallType>("Orientación")
  const [identifiedViolence, setIdentifiedViolence] = useState(false)
  const [aggressorReported, setAggressorReported] = useState(false)
  const [previousComplaint, setPreviousComplaint] = useState(false)
  const [followUp, setFollowUp] = useState(false)
  const [savedId, setSavedId] = useState("")
  const [saveError, setSaveError] = useState("")
  const [formVersion, setFormVersion] = useState(0)
  const [familyCount, setFamilyCount] = useState(0)

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data: Record<string, string | string[]> = {}

    formData.forEach((value, key) => {
      const fieldValue = String(value)
      const existing = data[key]
      data[key] = existing
        ? Array.isArray(existing)
          ? [...existing, fieldValue]
          : [existing, fieldValue]
        : fieldValue
    })

    const selectedSubtypes = formData.getAll("subtypes").map(String)
    const violenceTypes = formData.getAll("violenceTypes").map(String)
    const nameParts = [formData.get("firstName"), formData.get("lastName")]
      .map((value) => String(value || "").trim())
      .filter(Boolean)
    const victimName = nameParts.join(" ") || "Llamada no identificada"
    const phone = [formData.get("phonePrefix"), formData.get("phoneNumber")]
      .map((value) => String(value || "").trim())
      .filter(Boolean)
      .join("-") || "—"
    const id = `0800-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
    const record: CallRecord = {
      id,
      createdAt: String(formData.get("callDateTime") || new Date().toISOString()),
      callerName: victimName,
      phone,
      type: callType,
      subtypes: selectedSubtypes,
      followUp,
      redirectTo: followUp ? String(formData.get("redirectTo") || "") : "",
      victimName: callType === "Información" || callType === "No relevantes" ? "—" : victimName,
      state: String(formData.get("state") || "—"),
      violenceTypes,
      aggressorName: aggressorReported
        ? `${String(formData.get("aggressorFirstName") || "")} ${String(formData.get("aggressorLastName") || "")}`.trim()
        : "—",
      notes: String(formData.get("notes") || ""),
      data,
    }

    try {
      saveCallRecord(record)
      setSaveError("")
      setSavedId(id)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error) {
      console.error("No se pudo guardar la llamada 0800.", error)
      setSaveError("No fue posible guardar la llamada en este navegador. Intenta nuevamente.")
    }
  }

  function handleNewRecord() {
    setSavedId("")
    setCallType("Orientación")
    setIdentifiedViolence(false)
    setAggressorReported(false)
    setPreviousComplaint(false)
    setFollowUp(false)
    setFamilyCount(0)
    setFormVersion((version) => version + 1)
  }

  return (
    <main className="min-h-svh bg-[#f7f8fc] text-slate-900">
      <SectionHeader onLogout={onLogout} />
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
        <Link
          to="/0800/registros"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#172d55]"
        >
          <ArrowLeftIcon size={16} aria-hidden="true" />
          Volver a registros
        </Link>
        {savedId && (
          <div role="status" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <span className="flex items-center gap-2">
              <CheckCircleIcon size={20} weight="fill" />
              Llamada guardada correctamente. Código: <strong>{savedId}</strong>
            </span>
            <Button type="button" variant="outline" onClick={handleNewRecord}>
              Registrar otra llamada
            </Button>
          </div>
        )}
        {saveError && (
          <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {saveError}
          </div>
        )}

        <div className="mb-7 flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#315d91]">
            <ClipboardTextIcon size={25} weight="duotone" />
          </span>
          <div>
            <p className="text-sm font-medium text-[#315d91]">Módulo de atención 0800</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Registrar llamada</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Completa la información de la atención recibida. Los campos con * son obligatorios.
            </p>
          </div>
        </div>
        <p className="mb-5 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm text-blue-900">
          Versión de prueba: la información se guarda localmente en este navegador y no se envía a una API.
        </p>

        <form key={formVersion} className="grid gap-5" onSubmit={handleSubmit}>
          <FormSection title="Datos de la llamada" description="Clasifica la consulta y registra cuándo se recibió.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Fecha y hora de la llamada *">
                <Input
                  type="datetime-local"
                  name="callDateTime"
                  required
                  defaultValue={callDateTime}
                  className="h-10 border-slate-200 bg-white"
                />
              </Field>
              <Field label="Operadora que registra">
                <Input name="operator" maxLength={60} placeholder="Nombre de la operadora" className="h-10 border-slate-200 bg-white" />
              </Field>
            </div>
            <fieldset className="mt-6">
              <legend className="mb-2 text-sm font-medium text-slate-700">Tipo de llamada *</legend>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {callTypes.map((type) => (
                  <label key={type} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm font-medium transition ${callType === type ? "border-blue-300 bg-blue-50 text-[#172d55]" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}>
                    <input type="radio" name="callType" value={type} required checked={callType === type} onChange={() => setCallType(type)} className="size-4 accent-[#315d91]" />
                    {type}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-6">
              <legend className="mb-2 text-sm font-medium text-slate-700">Subtipo(s) de llamada</legend>
              <CheckOptions name="subtypes" options={subtypeOptions[callType]} />
            </fieldset>
          </FormSection>

          {(callType === "Orientación" || callType === "Intervención") && (
            <>
              <FormSection title="Datos de la agraviada" description="Registra solo la información que la persona pueda proporcionar.">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="Tipo de documento"><Select name="documentType" options={["Cédula", "RIF", "Pasaporte"]} /></Field>
                  <Field label="Número de documento"><Input name="documentNumber" maxLength={20} className="h-10 border-slate-200 bg-white" /></Field>
                  <Field label="Nombres"><Input name="firstName" maxLength={30} className="h-10 border-slate-200 bg-white" /></Field>
                  <Field label="Apellidos"><Input name="lastName" maxLength={30} className="h-10 border-slate-200 bg-white" /></Field>
                  <Field label="Teléfono principal">
                    <div className="flex gap-2">
                      <select name="phonePrefix" aria-label="Código telefónico" className="h-10 rounded-lg border border-slate-200 bg-white px-2 text-sm">
                        <option value="">Código</option>
                        {["0412", "0424", "0416", "0426", "0414"].map((prefix) => <option key={prefix}>{prefix}</option>)}
                      </select>
                      <Input name="phoneNumber" inputMode="numeric" maxLength={7} className="h-10 border-slate-200 bg-white" />
                    </div>
                  </Field>
                  <Field label="Teléfono secundario"><Input name="phone2" inputMode="tel" className="h-10 border-slate-200 bg-white" /></Field>
                  <Field label="Fecha de nacimiento"><Input type="date" name="birthDate" className="h-10 border-slate-200 bg-white" /></Field>
                  <Field label="Género"><Select name="gender" options={["Femenino", "Masculino", "Otro"]} /></Field>
                  <Field label="Estado"><Select name="state" options={states} /></Field>
                  <Field label="Municipio"><Input name="municipality" placeholder="Municipio" className="h-10 border-slate-200 bg-white" /></Field>
                  <Field label="Parroquia"><Input name="parish" placeholder="Parroquia" className="h-10 border-slate-200 bg-white" /></Field>
                  <Field label="Número de hijos"><Input type="number" min="0" name="children" className="h-10 border-slate-200 bg-white" /></Field>
                  <Field label="¿Está embarazada?"><Select name="pregnant" options={["Sí", "No"]} /></Field>
                  <Field label="Etnia"><Select name="ethnicity" options={["Negra", "Blanca", "Morena", "Indígena", "Afrodescendiente", "Otra"]} /></Field>
                  <Field label="Estado civil"><Select name="maritalStatus" options={["Soltera", "Casada", "Divorciada", "Separada", "Concubina", "Ex concubina", "Viuda"]} /></Field>
                  <Field label="Nivel de instrucción"><Select name="education" options={["Analfabeta", "Primaria completa", "Secundaria completa", "Técnico medio", "TSU", "Universitaria", "Postgrado", "Primaria incompleta", "Secundaria incompleta", "Ninguno"]} /></Field>
                  <Field label="Ocupación"><Select name="occupation" options={["Desempleada", "Ama de casa", "Estudiante", "Área de salud", "Área administrativa", "Empresaria", "Comerciante", "Independiente", "Vendedora", "Artista", "Peluquera", "Costurera", "Jubilada", "Otra"]} /></Field>
                  <Field label="Dirección" className="sm:col-span-2 lg:col-span-3">
                    <textarea name="address" rows={3} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-blue-400 focus:ring-3 focus:ring-blue-100" />
                  </Field>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label="¿Tiene denuncias anteriores?">
                    <select
                      name="previousComplaint"
                      onChange={(event) => setPreviousComplaint(event.currentTarget.value === "Sí")}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal text-slate-700 outline-none focus:border-blue-400 focus:ring-3 focus:ring-blue-100"
                    >
                      <option value="">Seleccionar</option>
                      <option>Sí</option>
                      <option>No</option>
                    </select>
                  </Field>
                  <Field label="Órgano receptor de la denuncia">
                    <Input name="complaintAgency" maxLength={100} disabled={!previousComplaint} className="h-10 border-slate-200 bg-white disabled:bg-slate-100" />
                  </Field>
                </div>
              </FormSection>

              <FormSection
                title="Familiares"
                description="Puedes agregar hasta dos familiares relacionados con la llamada."
              >
                {familyCount > 0 && (
                  <div className="grid gap-4">
                    {Array.from({ length: familyCount }, (_, index) => (
                      <div key={index} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                        <h3 className="mb-4 text-sm font-semibold text-slate-700">Familiar {index + 1}</h3>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          <Field label="Parentesco">
                            <Select name={`family${index}Relationship`} options={["Hijo", "Hermano", "Tío", "Abuelo", "Primo", "Otro"]} />
                          </Field>
                          <Field label="Nombres">
                            <Input name={`family${index}FirstName`} className="h-10 border-slate-200 bg-white" />
                          </Field>
                          <Field label="Apellidos">
                            <Input name={`family${index}LastName`} className="h-10 border-slate-200 bg-white" />
                          </Field>
                          <Field label="Fecha de nacimiento">
                            <Input type="date" name={`family${index}BirthDate`} className="h-10 border-slate-200 bg-white" />
                          </Field>
                          <Field label="Sexo">
                            <Select name={`family${index}Gender`} options={["Femenino", "Masculino", "Otro"]} />
                          </Field>
                          <Field label="Teléfono">
                            <Input name={`family${index}Phone`} inputMode="tel" className="h-10 border-slate-200 bg-white" />
                          </Field>
                          <Field label="Teléfono secundario">
                            <Input name={`family${index}Phone2`} inputMode="tel" className="h-10 border-slate-200 bg-white" />
                          </Field>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {familyCount < 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFamilyCount((count) => count + 1)}
                    className="mt-4 gap-2 rounded-xl border-slate-200 bg-white"
                  >
                    <PlusCircleIcon size={17} />
                    Agregar familiar
                  </Button>
                )}
              </FormSection>

              <FormSection title="Formas de violencia">
                <fieldset>
                  <legend className="mb-3 text-sm font-medium text-slate-700">¿Se identificaron formas de violencia?</legend>
                  <div className="flex gap-5">
                    {[true, false].map((value) => (
                      <label key={String(value)} className="flex items-center gap-2 text-sm text-slate-600">
                          <input type="radio" name="identifiedViolence" value={value ? "Sí" : "No"} checked={identifiedViolence === value} onChange={() => setIdentifiedViolence(value)} className="size-4 accent-[#315d91]" />
                        {value ? "Sí" : "No"}
                      </label>
                    ))}
                  </div>
                  {identifiedViolence && <div className="mt-4"><CheckOptions name="violenceTypes" options={violenceOptions} /></div>}
                </fieldset>
              </FormSection>

              <FormSection title="Datos del agresor">
                <fieldset>
                  <legend className="mb-3 text-sm font-medium text-slate-700">¿La persona indicó datos del agresor?</legend>
                  <div className="flex gap-5">
                    {[true, false].map((value) => (
                      <label key={String(value)} className="flex items-center gap-2 text-sm text-slate-600">
                        <input type="radio" name="aggressorReported" value={value ? "Sí" : "No"} checked={aggressorReported === value} onChange={() => setAggressorReported(value)} className="size-4 accent-[#315d91]" />
                        {value ? "Sí" : "No"}
                      </label>
                    ))}
                  </div>
                  {aggressorReported && (
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <Field label="Nombres"><Input name="aggressorFirstName" className="h-10 border-slate-200 bg-white" /></Field>
                      <Field label="Apellidos"><Input name="aggressorLastName" className="h-10 border-slate-200 bg-white" /></Field>
                      <Field label="Vínculo"><Select name="aggressorRelationship" options={["Amigo", "Concubino", "Esposo", "Ex concubino", "Ex esposo", "Ex novio", "Novio", "Hermano", "Padre", "Hijo", "Primo", "Tío", "Vecino"]} /></Field>
                    </div>
                  )}
                </fieldset>
              </FormSection>

              <FormSection title="Intervención institucional">
                <Field label="¿Ha recurrido a instituciones anteriormente?">
                  <Select name="institutionalSupport" options={["Sí", "No"]} />
                </Field>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Organismo receptor"><Input name="institution" className="h-10 border-slate-200 bg-white" /></Field>
                  <Field label="Funcionario/a"><Input name="official" className="h-10 border-slate-200 bg-white" /></Field>
                  <Field label="Cargo"><Input name="officialRole" className="h-10 border-slate-200 bg-white" /></Field>
                  <Field label="Respuesta"><Select name="institutionResponse" options={["Acudió en tiempo acordado", "Incumplió en tiempo acordado", "No acudió"]} /></Field>
                  <Field label="Observaciones" className="sm:col-span-2">
                    <textarea name="institutionNotes" rows={3} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-blue-400 focus:ring-3 focus:ring-blue-100" />
                  </Field>
                </div>
              </FormSection>
            </>
          )}

          {(callType === "Orientación" || callType === "Intervención") && (
            <FormSection title="Datos de contacto">
              <Field label="¿La persona desea ser contactada?">
                <Select name="wantsContact" options={["Sí", "No"]} />
              </Field>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Nombre de contacto"><Input name="contactName" className="h-10 border-slate-200 bg-white" /></Field>
                <Field label="Apellido de contacto"><Input name="contactLastName" className="h-10 border-slate-200 bg-white" /></Field>
                <Field label="Teléfono"><Input name="contactPhone" inputMode="tel" className="h-10 border-slate-200 bg-white" /></Field>
                <Field label="Teléfono celular"><Input name="contactMobile" inputMode="tel" className="h-10 border-slate-200 bg-white" /></Field>
                <Field label="Correo electrónico"><Input type="email" name="contactEmail" className="h-10 border-slate-200 bg-white" /></Field>
              </div>
            </FormSection>
          )}

          <FormSection title="Seguimiento y observaciones">
            <fieldset>
              <legend className="mb-3 text-sm font-medium text-slate-700">¿El caso necesita seguimiento?</legend>
              <div className="flex gap-5">
                {[true, false].map((value) => (
                  <label key={String(value)} className="flex items-center gap-2 text-sm text-slate-600">
                    <input type="radio" name="followUp" value={value ? "Sí" : "No"} checked={followUp === value} onChange={() => setFollowUp(value)} className="size-4 accent-[#315d91]" />
                    {value ? "Sí" : "No"}
                  </label>
                ))}
              </div>
              {followUp && (
                <div className="mt-4 max-w-sm">
                  <Field label="Redirigir a">
                    <select name="redirectTo" required className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400">
                      <option value="">Seleccionar</option>
                      <option>Defensoría</option>
                      <option>Psiquiatría</option>
                      <option>Ayuda ciudadana</option>
                    </select>
                  </Field>
                </div>
              )}
            </fieldset>
            <Field label="Resumen de la atención" className="mt-5">
              <textarea name="notes" rows={4} maxLength={1000} placeholder="Anota información relevante de la llamada..." className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-blue-400 focus:ring-3 focus:ring-blue-100" />
            </Field>
          </FormSection>

          <div className="flex flex-wrap justify-end gap-3 pb-8">
            <Button type="button" variant="outline" asChild className="h-11 rounded-xl border-slate-200 bg-white px-5">
              <Link to="/0800/registros">Cancelar</Link>
            </Button>
            <Button type="submit" className="h-11 gap-2 rounded-xl bg-[#172d55] px-5 text-white hover:bg-[#243f70]">
              <FloppyDiskIcon size={18} />
              Guardar llamada
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}