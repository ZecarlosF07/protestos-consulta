/** Avatar con iniciales del usuario */
export function Avatar({ name, size = 'md' }) {
    const initials = extractInitials(name)

    const sizeClasses = {
        sm: 'h-8 w-8 text-xs',
        md: 'h-9 w-9 text-sm',
    }

    return (
        <div
            className={`flex items-center justify-center rounded-full bg-primary font-semibold text-white ${sizeClasses[size]}`}
        >
            {initials}
        </div>
    )
}

function extractInitials(name) {
    if (!name) return '?'

    return name
        .split(' ')
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .toUpperCase()
}
