import { useNavigate } from 'react-router-dom'

import { PageHeader } from '../../shared/components/organisms/PageHeader'
import { useFormatos } from '../hooks/useFormatos'
import { FormatoCard } from './FormatoCard'

/** Página principal del módulo de formatos PDF (Admin) */
export function FormatosPage() {
    const navigate = useNavigate()
    const { formatos, isLoading, error } = useFormatos()

    const handleSeleccionar = (formatoId) => {
        navigate(`/admin/formatos/${formatoId}`)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                <span className="ml-3 text-sm text-text-secondary">Cargando formatos...</span>
            </div>
        )
    }

    return (
        <div>
            <PageHeader
                title="Formatos PDF"
                subtitle="Generación de documentos oficiales con correlativos independientes"
            />

            {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {formatos.map((formato) => (
                    <FormatoCard
                        key={formato.id}
                        formato={formato}
                        onSeleccionar={handleSeleccionar}
                    />
                ))}
            </div>

            {formatos.length === 0 && !error && (
                <div className="rounded-xl border border-border bg-white p-8 text-center">
                    <p className="text-sm text-text-secondary">
                        No se encontraron formatos disponibles.
                    </p>
                </div>
            )}
        </div>
    )
}
