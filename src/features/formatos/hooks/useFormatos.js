import { useCallback, useEffect, useState } from 'react'

import { obtenerFormatos } from '../services/formatos.service'

/** Hook para obtener los formatos PDF disponibles */
export function useFormatos() {
    const [formatos, setFormatos] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const cargar = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const data = await obtenerFormatos()
            setFormatos(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        cargar()
    }, [cargar])

    return { formatos, isLoading, error, recargar: cargar }
}
