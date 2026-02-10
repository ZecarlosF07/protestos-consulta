/** Mensaje de error con estilo sutil */
export function ErrorMessage({ message }) {
    if (!message) return null

    return (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">{message}</p>
        </div>
    )
}
