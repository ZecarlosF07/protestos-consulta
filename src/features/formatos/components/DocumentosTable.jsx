import { Icon } from '../../shared/components/atoms/Icon'
import { DocumentoEstadoBadge } from './DocumentoEstadoBadge'
import { formatearCorrelativo, formatearFechaFormato, labelTipoSolicitante } from '../utils/formatos.utils'

/** Tabla de documentos emitidos con acciones de descarga y anulación */
export function DocumentosTable({ documentos, onDescargar, onAnular }) {
    if (documentos.length === 0) {
        return (
            <div className="rounded-xl border border-border bg-white p-8 text-center">
                <Icon name="file" className="mx-auto h-10 w-10 text-text-muted" />
                <p className="mt-3 text-sm text-text-secondary">
                    No se han generado documentos para este formato.
                </p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-border bg-white">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-surface text-xs uppercase tracking-wide text-text-secondary">
                    <tr>
                        <th className="px-4 py-3">Correlativo</th>
                        <th className="px-4 py-3">Solicitante</th>
                        <th className="px-4 py-3">Documento</th>
                        <th className="px-4 py-3">Emisor</th>
                        <th className="px-4 py-3">Fecha</th>
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {documentos.map((doc) => (
                        <DocumentoRow
                            key={doc.id}
                            documento={doc}
                            onDescargar={onDescargar}
                            onAnular={onAnular}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function DocumentoRow({ documento, onDescargar, onAnular }) {
    const tipoLabel = labelTipoSolicitante(documento.tipo_solicitante)

    return (
        <tr className="transition-colors hover:bg-surface/50">
            <td className="px-4 py-3 font-semibold text-text-primary">
                {formatearCorrelativo(documento.correlativo)}
            </td>
            <td className="px-4 py-3">
                <p className="font-medium text-text-primary">{documento.nombre_solicitante}</p>
                <p className="text-xs text-text-muted">{tipoLabel}: {documento.nro_documento}</p>
            </td>
            <td className="px-4 py-3 text-text-secondary">
                {tipoLabel}
            </td>
            <td className="px-4 py-3 text-text-secondary">
                {documento.emisor?.nombre_completo ?? '—'}
            </td>
            <td className="px-4 py-3 text-text-secondary">
                {formatearFechaFormato(documento.created_at)}
            </td>
            <td className="px-4 py-3">
                <DocumentoEstadoBadge estado={documento.estado} />
                <AnulacionInfo documento={documento} />
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                    {documento.pdf_ruta && (
                        <button
                            onClick={() => onDescargar(documento.pdf_ruta)}
                            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-dark"
                            title="Descargar PDF"
                        >
                            <Icon name="download" className="h-4 w-4" />
                        </button>
                    )}
                    {documento.estado === 'activo' && (
                        <button
                            onClick={() => onAnular(documento)}
                            className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                            title="Anular"
                        >
                            <Icon name="xCircle" className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    )
}

function AnulacionInfo({ documento }) {
    if (documento.estado !== 'anulado') return null

    return (
        <p className="mt-0.5 text-xs text-red-500" title={documento.motivo_anulacion}>
            {documento.motivo_anulacion?.substring(0, 40)}
            {documento.motivo_anulacion?.length > 40 ? '...' : ''}
        </p>
    )
}
