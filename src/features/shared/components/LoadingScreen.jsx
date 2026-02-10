export function LoadingScreen() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-surface">
            <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-accent" />
                <p className="text-sm text-text-secondary">Cargando...</p>
            </div>
        </div>
    )
}
