import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { ROLES } from '../config/roles'
import { ROUTES } from '../config/routes'
import { AdminDashboard } from '../features/admin/components/AdminDashboard'
import { AdminLayout } from '../features/admin/components/AdminLayout'
import { AnalistasPage } from '../features/admin/components/AnalistasPage'
import { EntidadesPage } from '../features/admin/components/EntidadesPage'
import { ImportarProtestosPage } from '../features/admin/components/ImportarProtestosPage'
import { ProtestosPage } from '../features/admin/components/ProtestosPage'
import { AnalystDashboard } from '../features/analyst/components/AnalystDashboard'
import { AnalystLayout } from '../features/analyst/components/AnalystLayout'
import { LoginPage } from '../features/auth/components/LoginPage'
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute'
import { ConsultaProtestosPage } from '../features/consulta/components/ConsultaProtestosPage'
import { AuditDashboardPage } from '../features/auditoria/components/AuditDashboardPage'
import { AdminSolicitudesPage } from '../features/levantamiento/components/AdminSolicitudesPage'
import { AnalistaSolicitudesPage } from '../features/levantamiento/components/AnalistaSolicitudesPage'
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
                    <Route path="analistas" element={<AnalistasPage />} />
                    <Route path="analistas/nuevo" element={<Navigate to={ROUTES.ADMIN_ANALYSTS} replace />} />
                    <Route path="entidades" element={<EntidadesPage />} />
                    <Route path="protestos" element={<ProtestosPage />} />
                    <Route path="importar" element={<ImportarProtestosPage />} />
                    <Route path="auditoria" element={<AuditDashboardPage />} />
                    <Route path="solicitudes" element={<AdminSolicitudesPage />} />
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
                    <Route path="consulta" element={<ConsultaProtestosPage />} />
                    <Route path="solicitudes" element={<AnalistaSolicitudesPage />} />
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
