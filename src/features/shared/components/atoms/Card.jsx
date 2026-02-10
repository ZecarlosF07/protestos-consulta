/** Tarjeta base con borde sutil y fondo blanco */
export function Card({ children, className = '' }) {
    return (
        <div className={`rounded-xl border border-border bg-white p-5 ${className}`}>
            {children}
        </div>
    )
}
