import { useState } from 'react'

import { Icon } from '../../shared/components/atoms/Icon'
import { PageHeader } from '../../shared/components/organisms/PageHeader'
import { ConfirmModal } from '../../shared/components/molecules/ConfirmModal'
import { useAnalistas } from '../hooks/useAnalistas'
import { AnalistasFilters } from './AnalistasFilters'
import { AnalistasTable } from './AnalistasTable'
import { AnalistaFormModal } from './AnalistaFormModal'
import { ResetPasswordModal } from './ResetPasswordModal'

/** Página de gestión de analistas (Admin) */
export function AnalistasPage() {
    const {
        analistas, entidades, isLoading, error,
        filtroEntidad, filtroEstado,
        setFiltroEntidad, setFiltroEstado,
        crear, editar, bloquear, desbloquear, resetearPassword, recargar,
    } = useAnalistas()

    const [showForm, setShowForm] = useState(false)
    const [editingAnalista, setEditingAnalista] = useState(null)
    const [confirmAction, setConfirmAction] = useState(null)
    const [resetTarget, setResetTarget] = useState(null)
    const [actionError, setActionError] = useState(null)

    const handleEditar = (analista) => {
        setEditingAnalista(analista)
        setShowForm(true)
    }

    const handleFormSubmit = async (formData) => {
        if (editingAnalista) {
            await editar(editingAnalista.id, formData)
        } else {
            await crear(formData)
        }
    }

    const handleCloseForm = () => {
        setShowForm(false)
        setEditingAnalista(null)
    }

    const handleToggleEstado = (analista) => {
        const isBloqueado = analista.estado === 'bloqueado'
        setConfirmAction({
            title: isBloqueado ? 'Desbloquear analista' : 'Bloquear analista',
            message: isBloqueado
                ? `¿Desbloquear a ${analista.nombre_completo}?`
                : `¿Bloquear a ${analista.nombre_completo}? No podrá acceder al sistema.`,
            confirmLabel: isBloqueado ? 'Desbloquear' : 'Bloquear',
            variant: isBloqueado ? 'success' : 'warning',
            execute: async () => {
                isBloqueado ? await desbloquear(analista) : await bloquear(analista)
            },
        })
    }

    const handleResetPassword = (analista) => {
        setResetTarget(analista)
    }

    const handleResetSubmit = async (analista, newPassword) => {
        setActionError(null)
        await resetearPassword(analista, newPassword)
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
                <span className="ml-3 text-sm text-text-secondary">Cargando analistas...</span>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Gestión de Analistas"
                    subtitle={`${analistas.length} analista(s) registrado(s)`}
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
                        Nuevo analista
                    </button>
                </div>
            </div>

            {(error || actionError) && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error || actionError}
                </div>
            )}

            <div className="mb-4">
                <AnalistasFilters
                    entidades={entidades}
                    filtroEntidad={filtroEntidad}
                    filtroEstado={filtroEstado}
                    onEntidadChange={setFiltroEntidad}
                    onEstadoChange={setFiltroEstado}
                />
            </div>

            <AnalistasTable
                analistas={analistas}
                onEditar={handleEditar}
                onToggleEstado={handleToggleEstado}
                onResetPassword={handleResetPassword}
            />

            {showForm && (
                <AnalistaFormModal
                    entidades={entidades}
                    analista={editingAnalista}
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

            {resetTarget && (
                <ResetPasswordModal
                    analista={resetTarget}
                    onSubmit={handleResetSubmit}
                    onClose={() => setResetTarget(null)}
                />
            )}
        </div>
    )
}
