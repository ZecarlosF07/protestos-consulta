import { useCallback, useState } from 'react'

import { Icon } from '../../shared/components/atoms/Icon'
import { esSoloDigitos, MAX_DOCUMENT_LENGTH } from '../utils/documento.utils'

/**
 * Campo de búsqueda con validación en tiempo real.
 * Solo permite dígitos, máximo 11 caracteres.
 */
export function SearchInput({ onSearch, isLoading, onClear }) {
    const [valor, setValor] = useState('')

    const handleChange = useCallback((e) => {
        const input = e.target.value

        if (input && !esSoloDigitos(input)) return
        if (input.length > MAX_DOCUMENT_LENGTH) return

        setValor(input)

        if (!input) {
            onClear?.()
        }
    }, [onClear])

    const handleSubmit = useCallback((e) => {
        e.preventDefault()
        onSearch(valor)
    }, [valor, onSearch])

    const handleClear = useCallback(() => {
        setValor('')
        onClear?.()
    }, [onClear])

    return (
        <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Icon name="search" className="h-4.5 w-4.5 text-text-muted" />
                </div>
                <input
                    id="documento-input"
                    type="text"
                    inputMode="numeric"
                    placeholder="Ingrese DNI (8 dígitos) o RUC (11 dígitos)"
                    value={valor}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="off"
                    className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-10 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
                />
                {valor && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-text-secondary"
                    >
                        <Icon name="close" className="h-4 w-4" />
                    </button>
                )}
            </div>
            <button
                type="submit"
                disabled={isLoading || !valor}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                    <Icon name="search" className="h-4 w-4" />
                )}
                Consultar
            </button>
        </form>
    )
}
