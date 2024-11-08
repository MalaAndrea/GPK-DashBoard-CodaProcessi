// src/config/config.ts
import * as dotenv from 'dotenv';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from '../services/logger.js';
import { Database } from '../lib/database.types';

// Caricamento delle configurazioni dall'.env
dotenv.config({ path: './.env.development' });

// Estrazione e validazione delle variabili d'ambiente
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validazione della presenza delle variabili d'ambiente necessarie
if (!supabaseUrl || !supabaseServiceRoleKey) {
    logger.error('Configurazione Supabase: variabili d\'ambiente mancanti');
    throw new Error('Variabili d\'ambiente mancanti: SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
}

// Creazione del client Supabase con la chiave di servizio
export const supabase = createClient<Database>(supabaseUrl, supabaseServiceRoleKey);

// Funzione per verificare la connessione a Supabase
export async function verificaConnessioneSupabase(): Promise<boolean> {
    try {
        logger.info('Test connessione Supabase in corso...');
        
        const { data, error } = await supabase
            .schema('dashboard')
            .from('process_queue')
            .select('id')
            .limit(1);

        if (error) {
            logger.error('Test connessione Supabase fallito:', error.message);
            return false;
        }

        logger.info('Test connessione Supabase completato con successo');
        return true;
    } catch (error) {
        logger.error('Errore durante il test della connessione Supabase:', error);
        return false;
    }
}

// Funzione per ottenere lo stato delle code
export async function ottieniStatoCoda() {
    try {
        const { data: code, error } = await supabase
            .schema('dashboard')
            .from('process_queue')
            .select('*');

        if (error) {
            logger.error('Errore nel recupero delle code:', error.message);
            return null;
        }

        const codeAttive = code?.filter(coda => coda.active) || [];
        const codeInattive = code?.filter(coda => !coda.active) || [];

        // Log del riepilogo
        logger.info(`Riepilogo Stato Code - Totale: ${code?.length || 0}, Attive: ${codeAttive.length}, Inattive: ${codeInattive.length}`);

        // Log delle code attive
        if (codeAttive.length > 0) {
            logger.info('Code Attive:');
            codeAttive.forEach(coda => {
                logger.info(`  - ID: ${coda.id}
                Tipo: ${coda.interface_type}
                Intervallo: ${coda.interval_minutes} minuti
                Ultima esecuzione: ${coda.last_run || 'Mai eseguita'}
                Endpoint: ${coda.endpoint}
                Championship: ${coda.championship || 'N/A'}`);
            });
        } else {
            logger.info('Nessuna coda attiva trovata');
        }

        // Log delle code inattive
        if (codeInattive.length > 0) {
            logger.info('Code Inattive:');
            codeInattive.forEach(coda => {
                logger.info(`  - ID: ${coda.id}
                Tipo: ${coda.interface_type}
                Intervallo: ${coda.interval_minutes} minuti
                Endpoint: ${coda.endpoint}
                Championship: ${coda.championship || 'N/A'}`);
            });
        } else {
            logger.info('Nessuna coda inattiva trovata');
        }

        return { codeAttive, codeInattive };
    } catch (error) {
        logger.error('Errore durante il recupero dello stato delle code:', error);
        return null;
    }
}