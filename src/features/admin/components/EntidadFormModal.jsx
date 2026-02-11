import { useState } from 'react'

import { Icon } from '../../shared/components/atoms/Icon'

/** Modal para crear o editar una entidad financiera */
export function EntidadFormModal({ entidad = null, onSubmit, onClose }) {
    const isEditing = !!entidad
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)
    const [nombre, setNombre] = useState(entidad?.nombre ?? '')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (!nombre.trim()) {
            setError('El nombre es obligatorio')
            return
        }

        setIsSubmitting(true)

        try {
            await onSubmit({ nombre: nombre.trim() })
            onClose()
        } catch (err) {
            setError(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="mx-4 w-full max-w-md rounded-xl bg-white shadow-lg">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                    <h3 className="font-semibold text-text-primary">
                        {isEditing ? 'Editar Entidad' : 'Nueva Entidad Financiera'}
                    </h3>
                    <button onClick={onClose} className="text-text-muted hover:text-text-primary">
                        <Icon name="close" className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 p-5">
                    {error && (
                        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
                    )}

                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-text-secondary">
                            Nombre de la entidad <span className="text-red-400">*</span>
                        </span>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: Banco de la Nación"
                            required
                            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
                        />
                    </label>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:bg-surface-dark"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
                        >
                            {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear entidad'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
