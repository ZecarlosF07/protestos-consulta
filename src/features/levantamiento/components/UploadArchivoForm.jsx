import { useState } from 'react'

import { Icon } from '../../shared/components/atoms/Icon'
import { useUploadArchivo } from '../hooks/useUploadArchivo'
import {
    ARCHIVO_TIPOS,
    UPLOAD_CONFIG,
    COSTO_CERTIFICADO,
    CUENTA_DEPOSITO_INFO,
} from '../types/levantamiento.types'
import { FileSelectSlot } from './SingleUploadSlot'

/**
 * Formulario de subida de documentos para una solicitud.
 * Incluye: comprobante (con info de depósito), formato firmado,
 * carta de no adeudo, y comprobante de certificado (condicional).
 */
export function UploadArchivoForm({ solicitud, onUploaded }) {
    const { subir, isUploading, error } = useUploadArchivo()
    const [comprobanteFile, setComprobanteFile] = useState(null)
    const [formatoFile, setFormatoFile] = useState(null)
    const [cartaNoAdeudoFile, setCartaNoAdeudoFile] = useState(null)
    const [comprobanteCertFile, setComprobanteCertFile] = useState(null)
    const [uploadError, setUploadError] = useState(null)

    const archivosExistentes = solicitud.archivos ?? []
    const requiereCertificado = solicitud.requiere_certificado

    const buscarExistente = (tipo) =>
        archivosExistentes.find((a) => a.tipo === tipo)

    const archivosParaSubir = [
        { file: comprobanteFile, tipo: ARCHIVO_TIPOS.COMPROBANTE, setFile: setComprobanteFile },
        { file: formatoFile, tipo: ARCHIVO_TIPOS.FORMATO, setFile: setFormatoFile },
        { file: cartaNoAdeudoFile, tipo: ARCHIVO_TIPOS.CARTA_NO_ADEUDO, setFile: setCartaNoAdeudoFile },
        ...(requiereCertificado
            ? [{ file: comprobanteCertFile, tipo: ARCHIVO_TIPOS.COMPROBANTE_CERTIFICADO, setFile: setComprobanteCertFile }]
            : []),
    ]

    const hayArchivosParaSubir = archivosParaSubir.some((a) => a.file !== null)

    const handleSubirTodos = async () => {
        setUploadError(null)

        try {
            for (const { file, tipo, setFile } of archivosParaSubir) {
                if (!file) continue
                await subir(file, solicitud.id, tipo)
                setFile(null)
            }

            onUploaded?.()
        } catch (err) {
            setUploadError(err.message)
        }
    }

    const displayError = uploadError || error

    return (
        <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Documentos Requeridos
            </h4>

            <CuentaDepositoInfo />

            <FileSelectSlot
                tipo={ARCHIVO_TIPOS.COMPROBANTE}
                archivoExistente={buscarExistente(ARCHIVO_TIPOS.COMPROBANTE)}
                selectedFile={comprobanteFile}
                onFileChange={setComprobanteFile}
            />

            <FileSelectSlot
                tipo={ARCHIVO_TIPOS.FORMATO}
                archivoExistente={buscarExistente(ARCHIVO_TIPOS.FORMATO)}
                selectedFile={formatoFile}
                onFileChange={setFormatoFile}
            />

            <FileSelectSlot
                tipo={ARCHIVO_TIPOS.CARTA_NO_ADEUDO}
                archivoExistente={buscarExistente(ARCHIVO_TIPOS.CARTA_NO_ADEUDO)}
                selectedFile={cartaNoAdeudoFile}
                onFileChange={setCartaNoAdeudoFile}
            />

            {requiereCertificado && (
                <>
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                        <p className="text-xs font-medium text-amber-700">
                            Certificado de Título Regularizado requerido
                        </p>
                        <p className="mt-1 text-sm text-amber-900">
                            Costo del certificado: S/ {COSTO_CERTIFICADO}
                        </p>
                    </div>

                    <FileSelectSlot
                        tipo={ARCHIVO_TIPOS.COMPROBANTE_CERTIFICADO}
                        archivoExistente={buscarExistente(ARCHIVO_TIPOS.COMPROBANTE_CERTIFICADO)}
                        selectedFile={comprobanteCertFile}
                        onFileChange={setComprobanteCertFile}
                    />
                </>
            )}

            <p className="text-xs text-text-muted">
                Formatos: {UPLOAD_CONFIG.ALLOWED_EXTENSIONS.join(', ')} ·
                Máximo {UPLOAD_CONFIG.MAX_SIZE_MB}MB
            </p>

            {displayError && (
                <p className="text-xs text-red-600">{displayError}</p>
            )}

            {hayArchivosParaSubir && (
                <button
                    onClick={handleSubirTodos}
                    disabled={isUploading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
                >
                    <Icon name="upload" className="h-4 w-4" />
                    {isUploading ? 'Subiendo documentos...' : 'Subir documentos'}
                </button>
            )}
        </div>
    )
}

/** Muestra la información fija de las cuentas de depósito */
function CuentaDepositoInfo() {
    return (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="text-xs font-semibold text-blue-800">
                Cuenta de depósito para comprobante de pago
            </p>
            <p className="mt-1 text-xs font-medium text-blue-700">
                Titular: {CUENTA_DEPOSITO_INFO.titular}
            </p>
            <div className="mt-2 space-y-1">
                {CUENTA_DEPOSITO_INFO.cuentas.map(({ banco, cuenta, cci }) => (
                    <p key={banco} className="text-xs text-blue-600">
                        <span className="font-medium">{banco}</span>{' '}
                        {cuenta}, ó CCI: {cci}
                    </p>
                ))}
            </div>
        </div>
    )
}
