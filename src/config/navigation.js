import { ROUTES } from './routes'

/** Items de navegación del sidebar para el rol Administrador */
export const ADMIN_NAV_ITEMS = [
    { label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: 'dashboard' },
    { label: 'Analistas', path: ROUTES.ADMIN_ANALYSTS, icon: 'users' },
    { label: 'Protestos', path: ROUTES.ADMIN_PROTESTS, icon: 'file' },
    { label: 'Importar', path: ROUTES.ADMIN_IMPORT, icon: 'upload' },
    { label: 'Auditoría', path: ROUTES.ADMIN_AUDIT, icon: 'shield' },
]

/** Items de navegación del sidebar para el rol Analista */
export const ANALYST_NAV_ITEMS = [
    { label: 'Dashboard', path: ROUTES.ANALYST_DASHBOARD, icon: 'dashboard' },
    { label: 'Consulta', path: ROUTES.ANALYST_SEARCH, icon: 'search' },
    { label: 'Historial', path: ROUTES.ANALYST_HISTORY, icon: 'history' },
]
