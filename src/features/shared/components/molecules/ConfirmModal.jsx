import { Icon } from '../atoms/Icon'

/** Modal de confirmación genérico para acciones destructivas o importantes */
export function ConfirmModal({ title, message, confirmLabel, onConfirm, onClose, variant = 'warning' }) {
    const buttonStyles = {
        warning: 'bg-amber-500 hover:bg-amber-600',
        danger: 'bg-red-500 hover:bg-red-600',
        success: 'bg-emerald-500 hover:bg-emerald-600',
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="mx-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                        <Icon name="alert" className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-text-primary">{title}</h3>
                        <p className="mt-1 text-sm text-text-secondary">{message}</p>
                    </div>
                </div>

                <div className="mt-5 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:bg-surface-dark"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${buttonStyles[variant]}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
