import { Checkbox } from "@/components/ui/checkbox"

export function CheckOptions({
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
                    className="flex h-fit items-center gap-2 rounded-lg border bg-secondary px-3 py-2.5 text-sm"
                >
                    <Checkbox name={name} value={option} className="rounded-none" />
                    {option}
                </label>
            ))}
        </div>
    )
}