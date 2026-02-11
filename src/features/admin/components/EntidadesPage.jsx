import { useState } from 'react'

import { Icon } from '../../shared/components/atoms/Icon'
import { PageHeader } from '../../shared/components/organisms/PageHeader'
import { ConfirmModal } from '../../shared/components/molecules/ConfirmModal'
import { useEntidades } from '../hooks/useEntidades'
import { EntidadesFilters } from './EntidadesFilters'
import { EntidadesTable } from './EntidadesTable'
import { EntidadFormModal } from './EntidadFormModal'

/** Página de gestión de entidades financieras (Admin) */
export function EntidadesPage() {
    const {
        entidades, conteoAnalistas, isLoading, error,
        filtroEstado, busqueda,
        setFiltroEstado, setBusqueda,
        crear, editar, bloquear, desbloquear, recargar,
    } = useEntidades()

    const [showForm, setShowForm] = useState(false)
    const [editingEntidad, setEditingEntidad] = useState(null)
    const [confirmAction, setConfirmAction] = useState(null)
    const [actionError, setActionError] = useState(null)

    const handleEditar = (entidad) => {
        setEditingEntidad(entidad)
        setShowForm(true)
    }

    const handleFormSubmit = async (formData) => {
        if (editingEntidad) {
            await editar(editingEntidad.id, formData)
        } else {
            await crear(formData)
        }
    }

    const handleCloseForm = () => {
        setShowForm(false)
        setEditingEntidad(null)
    }

    const handleToggleEstado = (entidad) => {
        const isBloqueada = entidad.estado === 'bloqueada'
        const totalAnalistas = conteoAnalistas[entidad.id] ?? 0

        setConfirmAction({
            title: isBloqueada ? 'Desbloquear entidad' : 'Bloquear entidad',
            message: isBloqueada
                ? `¿Desbloquear "${entidad.nombre}"?`
                : `¿Bloquear "${entidad.nombre}"? ${totalAnalistas > 0 ? `Se bloquearán automáticamente ${totalAnalistas} analista(s) asociado(s).` : 'No tiene analistas asociados.'}`,
            confirmLabel: isBloqueada ? 'Desbloquear' : 'Bloquear',
            variant: isBloqueada ? 'success' : 'warning',
            execute: async () => {
                isBloqueada ? await desbloquear(entidad) : await bloquear(entidad)
            },
        })
    }

    const executeConfirmAction = async () => {
        try {
            setActionError(null)
            await confirmAction.execute()
            setConfirmAction(null)
        } catch (err) {
            setActionError(err.message)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                <span className="ml-3 text-sm text-text-secondary">Cargando entidades...</span>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Gestión de Entidades Financieras"
                    subtitle={`${entidades.length} entidad(es) registrada(s)`}
                />
                <div className="flex items-center gap-2">
                    <button
                        onClick={recargar}
                        className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-dark"
                    >
                        <Icon name="refresh" className="h-4 w-4" />
                        Actualizar
                    </button>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
                    >
                        <Icon name="plus" className="h-4 w-4" />
                        Nueva entidad
                    </button>
                </div>
            </div>

            {(error || actionError) && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error || actionError}
                </div>
            )}

            <div className="mb-4">
                <EntidadesFilters
                    filtroEstado={filtroEstado}
                    busqueda={busqueda}
                    onEstadoChange={setFiltroEstado}
                    onBusquedaChange={setBusqueda}
                />
            </div>

            <EntidadesTable
                entidades={entidades}
                conteoAnalistas={conteoAnalistas}
                onEditar={handleEditar}
                onToggleEstado={handleToggleEstado}
            />

            {showForm && (
                <EntidadFormModal
                    entidad={editingEntidad}
                    onSubmit={handleFormSubmit}
                    onClose={handleCloseForm}
                />
            )}

            {confirmAction && (
                <ConfirmModal
                    title={confirmAction.title}
                    message={confirmAction.message}
                    confirmLabel={confirmAction.confirmLabel}
                    variant={confirmAction.variant}
                    onConfirm={executeConfirmAction}
                    onClose={() => setConfirmAction(null)}
                />
            )}
        </div>
    )
}
