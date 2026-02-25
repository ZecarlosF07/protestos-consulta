import { useState } from 'react'

import { Icon } from '../../shared/components/atoms/Icon'

const MIN_PASSWORD_LENGTH = 6

/** Modal para que el admin establezca una nueva contraseña a un analista */
export function ResetPasswordModal({ analista, onSubmit, onClose }) {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (password.length < MIN_PASSWORD_LENGTH) {
            setError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`)
            return
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            return
        }

        setIsSubmitting(true)

        try {
            await onSubmit(analista, password)
            onClose()
        } catch (err) {
            setError(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="mx-4 w-full max-w-sm rounded-xl bg-white shadow-lg">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                    <h3 className="font-semibold text-text-primary">
                        Resetear contraseña
                    </h3>
                    <button onClick={onClose} className="text-text-muted hover:text-text-primary">
                        <Icon name="close" className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 p-5">
                    <p className="text-sm text-text-secondary">
                        Establecer nueva contraseña para{' '}
                        <span className="font-medium text-text-primary">{analista.nombre_completo}</span>
                    </p>

                    {error && (
                        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
                    )}

                    <FormField label="Nueva contraseña">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={MIN_PASSWORD_LENGTH}
                            required
                            autoFocus
                            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
                        />
                    </FormField>

                    <FormField label="Confirmar contraseña">
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            minLength={MIN_PASSWORD_LENGTH}
                            required
                            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
                        />
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
                            {isSubmitting ? 'Guardando...' : 'Cambiar contraseña'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function FormField({ label, children }) {
    return (
        <label className="block">
            <span className="mb-1 block text-sm font-medium text-text-secondary">
                {label} <span className="text-red-400">*</span>
            </span>
            {children}
        </label>
    )
}
