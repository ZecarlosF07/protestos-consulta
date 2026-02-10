import { Card } from '../../shared/components/atoms/Card'

/** Resumen superior con el número de resultados encontrados */
export function ResultadoResumen({ documentoConsultado, totalResultados }) {
    const { numero, tipo } = documentoConsultado
    const tieneProtestos = totalResultados > 0

    return (
        <Card className={tieneProtestos
            ? 'border-l-4 !border-l-error'
            : 'border-l-4 !border-l-success'
        }>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-text-secondary">
                        Resultado para {tipo}:
                        <span className="ml-1.5 font-semibold text-text-primary">
                            {numero}
                        </span>
                    </p>
                    <p className={`mt-1 text-sm font-medium ${tieneProtestos ? 'text-error' : 'text-success'}`}>
                        {tieneProtestos
                            ? `Se encontraron ${totalResultados} protesto(s) registrado(s)`
                            : 'No se encontraron protestos registrados'}
                    </p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${tieneProtestos ? 'bg-red-50' : 'bg-emerald-50'}`}>
                    <span className="text-lg">
                        {tieneProtestos ? '⚠️' : '✅'}
                    </span>
                </div>
            </div>
        </Card>
    )
}
