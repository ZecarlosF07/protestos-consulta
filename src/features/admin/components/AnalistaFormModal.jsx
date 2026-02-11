import { useState } from 'react'

import { Icon } from '../../shared/components/atoms/Icon'

/** Modal para crear o editar un analista */
export function AnalistaFormModal({ entidades, analista = null, onSubmit, onClose }) {
    const isEditing = !!analista
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const [formData, setFormData] = useState({
        nombre_completo: analista?.nombre_completo ?? '',
        dni: analista?.dni ?? '',
        email: analista?.email ?? '',
        telefono: analista?.telefono ?? '',
        cargo: analista?.cargo ?? '',
        entidad_financiera_id: analista?.entidad_financiera_id ?? '',
        password: '',
    })

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        try {
            await onSubmit(formData)
            onClose()
        } catch (err) {
            setError(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="mx-4 w-full max-w-lg rounded-xl bg-white shadow-lg">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                    <h3 className="font-semibold text-text-primary">
                        {isEditing ? 'Editar Analista' : 'Nuevo Analista'}
                    </h3>
                    <button onClick={onClose} className="text-text-muted hover:text-text-primary">
                        <Icon name="close" className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 p-5">
                    {error && (
                        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
                    )}

                    <FormField label="Nombre completo" required>
                        <input
                            type="text"
                            value={formData.nombre_completo}
                            onChange={(e) => updateField('nombre_completo', e.target.value)}
                            required
                            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
                        />
                    </FormField>

                    {!isEditing && (
                        <>
                            <FormField label="DNI" required>
                                <input
                                    type="text"
                                    value={formData.dni}
                                    onChange={(e) => updateField('dni', e.target.value)}
                                    maxLength={8}
                                    pattern="\d{8}"
                                    required
                                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
                                />
                            </FormField>

                            <FormField label="Email" required>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => updateField('email', e.target.value)}
                                    required
                                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
                                />
                            </FormField>

                            <FormField label="Contraseña" required>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => updateField('password', e.target.value)}
                                    minLength={6}
                                    required
                                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
                                />
                            </FormField>
                        </>
                    )}

                    <FormField label="Teléfono">
                        <input
                            type="text"
                            value={formData.telefono}
                            onChange={(e) => updateField('telefono', e.target.value)}
                            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
                        />
                    </FormField>

                    <FormField label="Cargo">
                        <input
                            type="text"
                            value={formData.cargo}
                            onChange={(e) => updateField('cargo', e.target.value)}
                            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
                        />
                    </FormField>

                    <FormField label="Entidad financiera" required>
                        <select
                            value={formData.entidad_financiera_id}
                            onChange={(e) => updateField('entidad_financiera_id', e.target.value)}
                            required
                            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
                        >
                            <option value="">Seleccionar...</option>
                            {entidades.map((e) => (
                                <option key={e.id} value={e.id}>{e.nombre}</option>
                            ))}
                        </select>
                    </FormField>

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
                            {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear analista'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function FormField({ label, required, children }) {
    return (
        <label className="block">
            <span className="mb-1 block text-sm font-medium text-text-secondary">
                {label} {required && <span className="text-red-400">*</span>}
            </span>
            {children}
        </label>
    )
}
