import {
    CONSTANCIA_DATE_FIELDS,
    CONSTANCIA_FIELD_LABELS,
    CONSTANCIA_FORM_SECTIONS,
    CONSTANCIA_REQUIRED_FIELDS,
} from '../types/constancia-anotacion.types'

const DATE_SECTION = {
    title: 'Fecha de anotación',
    fields: CONSTANCIA_DATE_FIELDS,
}

/** Formulario administrativo para emitir la constancia de anotación. */
export function ConstanciaAnotacionForm({ values, errors, onChange }) {
    return (
        <div className="max-h-[62vh] space-y-5 overflow-y-auto pr-1">
            {CONSTANCIA_FORM_SECTIONS.map((section) => (
                <FormSection
                    key={section.title}
                    section={section}
                    values={values}
                    errors={errors}
                    onChange={onChange}
                />
            ))}
            <FormSection
                section={DATE_SECTION}
                values={values}
                errors={errors}
                onChange={onChange}
                compact
            />
        </div>
    )
}

function FormSection({ section, values, errors, onChange, compact = false }) {
    return (
        <section className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                {section.title}
            </h4>
            <div className={compact ? 'grid grid-cols-3 gap-3' : 'grid gap-3 md:grid-cols-2'}>
                {section.fields.map((field) => (
                    <FieldInput
                        key={field}
                        name={field}
                        value={values[field]}
                        error={errors[field]}
                        compact={compact}
                        onChange={onChange}
                    />
                ))}
            </div>
        </section>
    )
}

function FieldInput({ name, value, error, compact, onChange }) {
    const required = CONSTANCIA_REQUIRED_FIELDS.includes(name)
    const fullWidth = ['deudor_domicilio', 'otros_datos_adicionales'].includes(name)

    return (
        <label className={fullWidth && !compact ? 'block md:col-span-2' : 'block'}>
            <span className="text-xs text-text-secondary">
                {CONSTANCIA_FIELD_LABELS[name]}{required ? ' *' : ''}
            </span>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                maxLength={getMaxLength(name)}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                    error
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-border focus:border-accent focus:ring-accent'
                }`}
            />
            {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
        </label>
    )
}

function getMaxLength(name) {
    if (name === 'deudor_documento') return 20
    if (name === 'fecha_anotacion_dia') return 2
    if (name === 'fecha_anotacion_anio') return 4
    return 120
}
