import { useCallback, useEffect, useState } from 'react'

import { Icon } from '../../shared/components/atoms/Icon'
import { supabase } from '../../../services/supabase/client'
import {
    exportarSolicitudesExcel,
    obtenerSolicitudesParaExportar,
} from '../services/exportar-solicitudes.service'

/**
 * Botón de exportación a Excel de solicitudes por entidad financiera.
 * Incluye selector de entidad y respeta filtros aplicados.
 */
export function ExportarSolicitudesButton() {
    const [isOpen, setIsOpen] = useState(false)
    const [entidades, setEntidades] = useState([])
    const [selectedEntidad, setSelectedEntidad] = useState('')
    const [isExporting, setIsExporting] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!isOpen) return

        const cargar = async () => {
            const { data } = await supabase
                .from('entidades_financieras')
                .select('id, nombre')
                .is('deleted_at', null)
                .order('nombre')

            setEntidades(data ?? [])
        }

        cargar()
    }, [isOpen])

    const handleExportar = useCallback(async () => {
        setIsExporting(true)
        setError(null)

        try {
            const entidadId = selectedEntidad || null
            const solicitudes = await obtenerSolicitudesParaExportar(entidadId)

            if (solicitudes.length === 0) {
                setError('No se encontraron solicitudes para exportar')
                return
            }

            const nombreEntidad = selectedEntidad
                ? entidades.find((e) => e.id === selectedEntidad)?.nombre ?? 'Entidad'
                : 'Todas'

            exportarSolicitudesExcel(solicitudes, nombreEntidad)
            setIsOpen(false)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsExporting(false)
        }
    }, [selectedEntidad, entidades])

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-dark"
            >
                <Icon name="download" className="h-4 w-4" />
                Exportar Excel
            </button>

            {isOpen && (
                <ExportPanel
                    entidades={entidades}
                    selectedEntidad={selectedEntidad}
                    onEntidadChange={setSelectedEntidad}
                    onExportar={handleExportar}
                    onClose={() => setIsOpen(false)}
                    isExporting={isExporting}
                    error={error}
                />
            )}
        </div>
    )
}

function ExportPanel({
    entidades,
    selectedEntidad,
    onEntidadChange,
    onExportar,
    onClose,
    isExporting,
    error,
}) {
    return (
        <div className="absolute right-0 top-full z-10 mt-2 w-80 rounded-xl border border-border bg-white p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-text-primary">
                    Exportar Solicitudes
                </p>
                <button
                    onClick={onClose}
                    className="rounded p-1 text-text-muted hover:bg-surface-dark"
                >
                    <Icon name="close" className="h-4 w-4" />
                </button>
            </div>

            <label className="block">
                <span className="text-xs text-text-secondary">Entidad Financiera</span>
                <select
                    value={selectedEntidad}
                    onChange={(e) => onEntidadChange(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                >
                    <option value="">Todas las entidades</option>
                    {entidades.map((e) => (
                        <option key={e.id} value={e.id}>{e.nombre}</option>
                    ))}
                </select>
            </label>

            {error && (
                <p className="mt-2 text-xs text-red-600">{error}</p>
            )}

            <button
                onClick={onExportar}
                disabled={isExporting}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
                <Icon name="download" className="h-4 w-4" />
                {isExporting ? 'Exportando...' : 'Descargar Excel'}
            </button>
        </div>
    )
}
