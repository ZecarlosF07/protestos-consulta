import { Card } from '../../shared/components/atoms/Card'
import { Icon } from '../../shared/components/atoms/Icon'
import { SolicitudEstadoBadge } from '../../shared/components/atoms/SolicitudEstadoBadge'
import { formatearFechaHora } from '../../auditoria/utils/auditoria.utils'
import { formatearMonto } from '../../consulta/utils/formato.utils'

/** Tabla de solicitudes de levantamiento */
export function SolicitudesTable({ solicitudes, onSelectSolicitud }) {
    if (solicitudes.length === 0) {
        return (
            <Card>
                <p className="py-8 text-center text-sm text-text-muted">
                    No se encontraron solicitudes
                </p>
            </Card>
        )
    }

    return (
        <Card className="overflow-hidden !p-0">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-surface-dark">
                        <tr>
                            {HEADERS.map(({ label, align }) => (
                                <th
                                    key={label}
                                    className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-secondary ${align}`}
                                >
                                    {label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {solicitudes.map((solicitud, index) => (
                            <SolicitudRow
                                key={solicitud.id}
                                solicitud={solicitud}
                                index={index}
                                onClick={() => onSelectSolicitud(solicitud)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}

const HEADERS = [
    { label: 'Persona', align: 'text-left' },
    { label: 'Documento', align: 'text-left' },
    { label: 'Monto', align: 'text-right' },
    { label: 'Analista', align: 'text-left' },
    { label: 'Entidad', align: 'text-left' },
    { label: 'Estado', align: 'text-center' },
    { label: 'Cert.', align: 'text-center' },
    { label: 'Fecha', align: 'text-center' },
    { label: '', align: 'text-center' },
]

/** Fila de solicitud */
function SolicitudRow({ solicitud, index, onClick }) {
    return (
        <tr
            className={`cursor-pointer transition-colors hover:bg-blue-50/50 ${index % 2 === 0 ? 'bg-white' : 'bg-surface'}`}
            onClick={onClick}
        >
            <td className="whitespace-nowrap px-4 py-3 text-sm text-text-primary">
                {solicitud.protesto?.nombre_persona ?? '—'}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-text-secondary">
                {solicitud.protesto?.numero_documento ?? '—'}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-text-primary">
                {solicitud.protesto?.monto
                    ? formatearMonto(solicitud.protesto.monto)
                    : '—'}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-text-secondary">
                {solicitud.usuario?.nombre_completo ?? '—'}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-text-secondary">
                {solicitud.entidad_financiera?.nombre ?? '—'}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-center">
                <SolicitudEstadoBadge estado={solicitud.estado} />
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-center">
                {solicitud.requiere_certificado && (
                    <span className="inline-flex rounded bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-700" title="Requiere certificado">
                        Cert
                    </span>
                )}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-text-secondary">
                {formatearFechaHora(solicitud.created_at)}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-center">
                <Icon name="eye" className="mx-auto h-4 w-4 text-text-muted" />
            </td>
        </tr>
    )
}
