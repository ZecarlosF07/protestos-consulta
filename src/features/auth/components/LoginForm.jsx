import { useState } from 'react'

export function LoginForm({ onSubmit, isSubmitting }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    function handleSubmit(e) {
        e.preventDefault()

        if (!email.trim() || !password.trim()) return

        onSubmit(email.trim(), password)
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <label
                    htmlFor="login-email"
                    className="text-sm font-medium text-text-primary"
                >
                    Correo electrónico
                </label>
                <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@entidad.com"
                    required
                    disabled={isSubmitting}
                    autoComplete="email"
                    className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label
                    htmlFor="login-password"
                    className="text-sm font-medium text-text-primary"
                >
                    Contraseña
                </label>
                <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isSubmitting}
                    autoComplete="current-password"
                    className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50"
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting || !email.trim() || !password.trim()}
                className="mt-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Ingresando...' : 'Ingresar'}
            </button>
        </form>
    )
}
