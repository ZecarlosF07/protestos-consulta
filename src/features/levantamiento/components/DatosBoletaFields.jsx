/** Campos condicionales para comprobante tipo Boleta */
export function DatosBoletaFields({ datos, onChange }) {
    const handleChange = (field) => (e) => {
        onChange({ ...datos, [field]: e.target.value })
    }

    return (
        <div className="space-y-3 rounded-lg border border-border p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Datos del solicitante (Boleta)
            </p>

            <label className="block">
                <span className="text-xs text-text-secondary">DNI *</span>
                <input
                    type="text"
                    value={datos.nroDocumento ?? ''}
                    onChange={handleChange('nroDocumento')}
                    maxLength={8}
                    placeholder="12345678"
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
            </label>

            <label className="block">
                <span className="text-xs text-text-secondary">Nombres y Apellidos *</span>
                <input
                    type="text"
                    value={datos.datos ?? ''}
                    onChange={handleChange('datos')}
                    placeholder="Nombres y apellidos completos"
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
            </label>

            <label className="block">
                <span className="text-xs text-text-secondary">Teléfono *</span>
                <input
                    type="text"
                    value={datos.telefono ?? ''}
                    onChange={handleChange('telefono')}
                    maxLength={20}
                    placeholder="999 999 999"
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
            </label>
        </div>
    )
}
