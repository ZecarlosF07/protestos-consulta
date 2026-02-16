import { useState } from 'react'

import { Icon } from '../../shared/components/atoms/Icon'
import { Card } from '../../shared/components/atoms/Card'
import {
    TIPO_COMPROBANTE_OPTIONS,
    COSTO_CERTIFICADO,
} from '../types/levantamiento.types'

/**
 * Modal para completar datos adicionales al crear una solicitud de levantamiento.
 * Captura: tipo de comprobante y si requiere certificado.
 */
export function SolicitudFormModal({ protesto, onConfirm, onClose, isLoading }) {
    const [tipoComprobante, setTipoComprobante] = useState('')
    const [requiereCertificado, setRequiereCertificado] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        onConfirm(protesto.id, {
            tipoComprobante: tipoComprobante || null,
            requiereCertificado,
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-lg">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text-primary">
                        Solicitud de Levantamiento
                    </h3>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-text-muted hover:bg-surface-dark"
                    >
                        <Icon name="close" className="h-5 w-5" />
                    </button>
                </div>

                <ProtestoResumen protesto={protesto} />

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <TipoComprobanteField
                        value={tipoComprobante}
                        onChange={setTipoComprobante}
                    />

                    <CertificadoCheckbox
                        checked={requiereCertificado}
                        onChange={setRequiereCertificado}
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
                    >
                        {isLoading ? 'Creando solicitud...' : 'Confirmar solicitud'}
                    </button>
                </form>
            </Card>
        </div>
    )
}

function ProtestoResumen({ protesto }) {
    return (
        <div className="rounded-lg bg-surface p-3 text-sm">
            <p className="font-medium text-text-primary">{protesto.nombre_persona}</p>
            <p className="text-text-muted">
                Doc: {protesto.numero_documento} · Monto: S/ {Number(protesto.monto).toFixed(2)}
            </p>
        </div>
    )
}

function TipoComprobanteField({ value, onChange }) {
    return (
        <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Tipo de comprobante
            </span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
                <option value="">Seleccione...</option>
                {TIPO_COMPROBANTE_OPTIONS.map(({ value: v, label }) => (
                    <option key={v} value={v}>{label}</option>
                ))}
            </select>
        </label>
    )
}

function CertificadoCheckbox({ checked, onChange }) {
    return (
        <div className="space-y-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-surface">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                />
                <span className="text-sm text-text-primary">
                    ¿Se requiere Certificado de Título Regularizado?
                </span>
            </label>

            {checked && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <p className="text-sm font-medium text-amber-800">
                        Costo del certificado: S/ {COSTO_CERTIFICADO}
                    </p>
                    <p className="mt-1 text-xs text-amber-600">
                        Deberá adjuntar comprobante de pago adicional por este concepto.
                    </p>
                </div>
            )}
        </div>
    )
}
