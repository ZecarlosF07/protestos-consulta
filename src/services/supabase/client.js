import { createClient } from '@supabase/supabase-js'

import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../../config/env'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
        'Faltan variables de entorno: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY'
    )
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
