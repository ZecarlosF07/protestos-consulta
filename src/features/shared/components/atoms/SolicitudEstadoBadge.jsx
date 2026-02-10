import { Icon } from '../../../shared/components/atoms/Icon'

/** Badge de estado de solicitud con color semántico */
export function SolicitudEstadoBadge({ estado }) {
    const config = BADGE_CONFIG[estado] ?? BADGE_CONFIG.default

    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.styles}`}>
            <Icon name={config.icon} className="h-3 w-3" />
            {config.label}
        </span>
    )
}

const BADGE_CONFIG = {
    registrada: {
        label: 'Registrada',
        styles: 'bg-blue-50 text-blue-700',
        icon: 'clipboard',
    },
    en_revision: {
        label: 'En revisión',
        styles: 'bg-amber-50 text-amber-700',
        icon: 'eye',
    },
    aprobada: {
        label: 'Aprobada',
        styles: 'bg-emerald-50 text-emerald-700',
        icon: 'checkCircle',
    },
    rechazada: {
        label: 'Rechazada',
        styles: 'bg-red-50 text-red-700',
        icon: 'xCircle',
    },
    default: {
        label: 'Desconocido',
        styles: 'bg-gray-50 text-gray-700',
        icon: 'alert',
    },
}
