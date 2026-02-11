import { createContext } from 'react'

/**
 * Contexto de autenticación.
 * Separado del Provider para compatibilidad con Vite HMR Fast Refresh.
 */
export const AuthContext = createContext(null)
