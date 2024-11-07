import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
// Caricamento delle configurazioni dall'.env
dotenv.config({ path: './.env.development' });
// Estrazione delle variabili di ambiente necessarie
export const supabaseUrl = process.env.SUPABASE_URL;
export const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
// Creazione del client Supabase con la chiave di servizio
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
