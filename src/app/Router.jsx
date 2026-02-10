import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { ROLES } from '../config/roles'
import { ROUTES } from '../config/routes'
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute'
import { LoginPage } from '../features/auth/components/LoginPage'
import { AdminLayout } from '../features/admin/components/AdminLayout'
import { AdminDashboard } from '../features/admin/components/AdminDashboard'
import { AnalystLayout } from '../features/analyst/components/AnalystLayout'
import { AnalystDashboard } from '../features/analyst/components/AnalystDashboard'
import { HomeRedirect } from '../features/shared/components/HomeRedirect'

export function Router() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas públicas */}
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />

                {/* Redirección inteligente según rol */}
                <Route path={ROUTES.HOME} element={<HomeRedirect />} />

                {/* Rutas del Administrador */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<AdminDashboard />} />
                    {/* Placeholder para hitos posteriores */}
                    <Route path="analistas" element={<PlaceholderPage title="Gestión de Analistas" />} />
                    <Route path="analistas/nuevo" element={<PlaceholderPage title="Nuevo Analista" />} />
                    <Route path="protestos" element={<PlaceholderPage title="Gestión de Protestos" />} />
                    <Route path="importar" element={<PlaceholderPage title="Importar Protestos" />} />
                    <Route path="auditoria" element={<PlaceholderPage title="Auditoría" />} />
                </Route>

                {/* Rutas del Analista */}
                <Route
                    path="/analista"
                    element={
                        <ProtectedRoute allowedRoles={[ROLES.ANALISTA]}>
                            <AnalystLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<AnalystDashboard />} />
                    {/* Placeholder para hitos posteriores */}
                    <Route path="consulta" element={<PlaceholderPage title="Consulta de Protestos" />} />
                    <Route path="historial" element={<PlaceholderPage title="Historial de Consultas" />} />
                </Route>

                {/* Ruta 404 */}
                <Route path="*" element={<HomeRedirect />} />
            </Routes>
        </BrowserRouter>
    )
}

/** Componente placeholder para páginas de hitos posteriores */
function PlaceholderPage({ title }) {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
            <p className="mt-2 text-sm text-text-muted">
                Este módulo será implementado en un hito posterior.
            </p>
        </div>
    )
}
