import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ehgarbrlikjlrbswttfs.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoZ2FyYnJsaWtqbHJic3d0dGZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NTE1NDAsImV4cCI6MjA4NjMyNzU0MH0.LuvspT72CYpBdbLV1girah06i57-fY7cq_0TywmWtZg'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Datos de prueba
const PROTESTOS_MOCK = [
    {
        secuencia: 'PROT-001',
        tipo_documento: 'DNI',
        numero_documento: '45896321', // DNI de prueba
        nombre_persona: 'JUAN PEREZ RODRIGUEZ',
        entidad_financiadora: 'BANCO DE CREDITO DEL PERU',
        entidad_fuente: 'NOTARIA GOMEZ',
        monto: 1500.50,
        fecha_protesto: '2025-11-15',
        tarifa_levantamiento: 45.00,
        estado: 'vigente'
    },
    {
        secuencia: 'PROT-002',
        tipo_documento: 'DNI',
        numero_documento: '45896321', // Mismo DNI para tener múltiple resultados
        nombre_persona: 'JUAN PEREZ RODRIGUEZ',
        entidad_financiadora: 'INTERBANK',
        entidad_fuente: 'CAMARA DE COMERCIO',
        monto: 3200.00,
        fecha_protesto: '2025-10-20',
        tarifa_levantamiento: 55.00,
        estado: 'en_proceso'
    },
    {
        secuencia: 'PROT-003',
        tipo_documento: 'RUC',
        numero_documento: '20556677889', // RUC de prueba
        nombre_persona: 'CONSTRUCTORA DEL SUR S.A.C.',
        entidad_financiadora: 'BBVA',
        entidad_fuente: 'NOTARIA RODRIGUEZ',
        monto: 15000.00,
        fecha_protesto: '2026-01-10',
        tarifa_levantamiento: 120.00,
        estado: 'vigente'
    },
    {
        secuencia: 'PROT-004',
        tipo_documento: 'DNI',
        numero_documento: '12345678', // DNI limpio (sin protestos vigentes, solo histórico)
        nombre_persona: 'MARIA LOPEZ',
        entidad_financiadora: 'SCOTIABANK',
        entidad_fuente: 'NOTARIA GOMEZ',
        monto: 500.00,
        fecha_protesto: '2024-05-10',
        tarifa_levantamiento: null,
        estado: 'levantado'
    }
]

async function seedProtestos() {
    console.log('=== SEED PROTESTOS === \n')

    // Necesitamos loguearnos como admin para tener permisos de escritura (según RLS)
    // O usar service_role key si estuviéramos en backend, pero aquí usaremos login
    const email = 'admin@camaraica.org.pe'
    const password = 'Admin2026!'

    console.log('1. Autenticando...')
    const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (authError) {
        console.error('Error de autenticación:', authError.message)
        process.exit(1)
    }

    console.log('   Autenticado como:', session.user.email)

    console.log('2. Insertando protestos de prueba...')

    // Insertamos uno por uno para manejar errores individuales
    for (const protesto of PROTESTOS_MOCK) {
        // Eliminar si existe (para limpiar datos previos de la prueba)
        await supabase.from('protestos').delete().eq('secuencia', protesto.secuencia)

        const { error } = await supabase
            .from('protestos')
            .insert(protesto)

        if (error) {
            console.error(`   Error insertando ${protesto.secuencia}:`, error.message)
        } else {
            console.log(`   ✅ Insertado: ${protesto.secuencia}`)
        }
    }

    console.log('\n=== SEED TERMINADO ===')
    console.log('Prueba buscando estos documentos:')
    console.log('1. DNI: 45896321 (Tiene 2 protestos)')
    console.log('2. RUC: 20556677889 (Tiene 1 protesto)')
    console.log('3. DNI: 12345678 (Tiene 1, pero levantado)')
}

seedProtestos()
