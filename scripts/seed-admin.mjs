import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ehgarbrlikjlrbswttfs.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoZ2FyYnJsaWtqbHJic3d0dGZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NTE1NDAsImV4cCI6MjA4NjMyNzU0MH0.LuvspT72CYpBdbLV1girah06i57-fY7cq_0TywmWtZg'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Usar email nuevo para evitar conflictos con datos corruptos
const ADMIN_EMAIL = 'admin@camaraica.org.pe'
const ADMIN_PASSWORD = 'Admin2026!'

async function seedAdmin() {
    console.log('=== SEED ADMIN (email nuevo) ===\n')

    // Paso 1: Signup con email nuevo
    console.log('1. Registrando usuario via signUp...')
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        options: {
            data: {
                nombre_completo: 'Administrador CCI',
                rol: 'admin',
            },
        },
    })

    if (signUpError) {
        console.error('   Error signUp:', signUpError.message)
        console.error('   Status:', signUpError.status)
        process.exit(1)
    }

    console.log('   SignUp OK')
    console.log('   User ID:', signUpData.user?.id)
    console.log('   Session:', signUpData.session ? 'SÍ' : 'NO (requiere confirmación de email)')

    if (!signUpData.session) {
        console.log('\n⚠️  Supabase requiere confirmación de email.')
        console.log('   Para deshabilitarlo: Dashboard > Authentication > Providers > Email > Disable "Confirm email"')
        console.log('   O confirma el email manualmente en Dashboard > Authentication > Users')
        console.log('\n   Después de confirmar, ejecuta este SQL en SQL Editor para crear el registro en usuarios:\n')
        console.log(`INSERT INTO usuarios (id, email, nombre_completo, dni, cargo, rol, estado)
VALUES (
  '${signUpData.user?.id}',
  '${ADMIN_EMAIL}',
  'Administrador CCI',
  '00000001',
  'Administrador del Sistema',
  'admin',
  'activo'
);`)
        process.exit(0)
    }

    // Si tenemos sesión, insertar en usuarios
    const userId = signUpData.user.id
    console.log('\n2. Insertando en tabla usuarios...')

    const { data: insertData, error: insertError } = await supabase
        .from('usuarios')
        .insert({
            id: userId,
            email: ADMIN_EMAIL,
            nombre_completo: 'Administrador CCI',
            dni: '00000001',
            cargo: 'Administrador del Sistema',
            rol: 'admin',
            entidad_financiera_id: null,
            estado: 'activo',
        })
        .select()

    if (insertError) {
        console.error('   Error insert:', insertError.message)
        console.log('\n   Ejecuta manualmente en SQL Editor:')
        console.log(`INSERT INTO usuarios (id, email, nombre_completo, dni, cargo, rol, estado)
VALUES ('${userId}', '${ADMIN_EMAIL}', 'Administrador CCI', '00000001', 'Administrador del Sistema', 'admin', 'activo');`)
        process.exit(1)
    }

    console.log('   Insertado OK:', insertData)
    console.log(`\n✅ Admin creado. Login: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`)
}

seedAdmin().catch((err) => {
    console.error('Error:', err)
    process.exit(1)
})
