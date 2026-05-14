import { TIPO_SOLICITANTE_OPTIONS } from '../types/formatos.types'

/** Campos base para formatos que solo requieren respaldo interno del solicitante. */
export function SolicitanteDocumentoForm({
    tipo,
    nroDocumento,
    nombre,
    onTipoChange,
    onDocChange,
    onNombreChange,
}) {
    const docLabel = tipo === 'empresa' ? 'RUC' : 'DNI'
    const nombreLabel = tipo === 'empresa' ? 'Razón Social' : 'Nombres y Apellidos'
    const docMaxLength = tipo === 'empresa' ? 11 : 8

    return (
        <>
            <TipoSelect value={tipo} onChange={onTipoChange} />

            {tipo && (
                <div className="space-y-3 rounded-lg border border-border p-3">
                    <CampoTexto
                        label={`${docLabel} *`}
                        value={nroDocumento}
                        maxLength={docMaxLength}
                        onChange={onDocChange}
                    />
                    <CampoTexto
                        label={`${nombreLabel} *`}
                        value={nombre}
                        onChange={onNombreChange}
                    />
                </div>
            )}
        </>
    )
}

function TipoSelect({ value, onChange }) {
    return (
        <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Tipo de solicitante *
            </span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
                <option value="">Seleccione...</option>
                {TIPO_SOLICITANTE_OPTIONS.map(({ value: v, label }) => (
                    <option key={v} value={v}>{label}</option>
                ))}
            </select>
        </label>
    )
}

function CampoTexto({ label, value, maxLength, onChange }) {
    return (
        <label className="block">
            <span className="text-xs text-text-secondary">{label}</span>
            <input
                type="text"
                value={value}
                maxLength={maxLength}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
        </label>
    )
}
