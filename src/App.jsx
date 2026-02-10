import { AuthProvider } from './features/auth/context/AuthContext'
import { Router } from './app/Router'

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  )
}
