import { Card } from '../../shared/components/atoms/Card'
import { EstadoBadge } from './EstadoBadge'
import { formatearFecha, formatearMonto } from '../utils/formato.utils'

/** Fila individual de la tabla de protestos */
function ProtestoRow({ protesto, index }) {
    return (
        <tr className={index % 2 === 0 ? 'bg-white' : 'bg-surface'}>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-text-primary">
                {protesto.nombre_persona}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-text-secondary">
                {protesto.entidad_financiadora}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-text-secondary">
                {protesto.entidad_fuente}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-text-primary text-right">
                {formatearMonto(protesto.monto)}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-text-secondary text-center">
                {formatearFecha(protesto.fecha_protesto)}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-center">
                <EstadoBadge estado={protesto.estado} />
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-text-secondary text-right">
                {protesto.tarifa_levantamiento
                    ? formatearMonto(protesto.tarifa_levantamiento)
                    : '—'}
            </td>
        </tr>
    )
}

/** Encabezados de la tabla */
const HEADERS = [
    { label: 'Persona', align: 'text-left' },
    { label: 'Entidad financiadora', align: 'text-left' },
    { label: 'Entidad fuente', align: 'text-left' },
    { label: 'Monto', align: 'text-right' },
    { label: 'Fecha', align: 'text-center' },
    { label: 'Estado', align: 'text-center' },
    { label: 'Tarifa', align: 'text-right' },
]

/** Tabla de resultados de protestos */
export function ProtestosTable({ protestos }) {
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
                        {protestos.map((protesto, index) => (
                            <ProtestoRow
                                key={protesto.id}
                                protesto={protesto}
                                index={index}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}
