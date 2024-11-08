var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/config/config.ts
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { logger } from '../services/logger.js';
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
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
// Funzione per verificare la connessione a Supabase
export function verificaConnessioneSupabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            logger.info('Test connessione Supabase in corso...');
            const { data, error } = yield supabase
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
        }
        catch (error) {
            logger.error('Errore durante il test della connessione Supabase:', error);
            return false;
        }
    });
}
// Funzione per ottenere lo stato delle code
export function ottieniStatoCoda() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data: code, error } = yield supabase
                .schema('dashboard')
                .from('process_queue')
                .select('*');
            if (error) {
                logger.error('Errore nel recupero delle code:', error.message);
                return null;
            }
            const codeAttive = (code === null || code === void 0 ? void 0 : code.filter(coda => coda.active)) || [];
            const codeInattive = (code === null || code === void 0 ? void 0 : code.filter(coda => !coda.active)) || [];
            // Log del riepilogo
            logger.info(`Riepilogo Stato Code - Totale: ${(code === null || code === void 0 ? void 0 : code.length) || 0}, Attive: ${codeAttive.length}, Inattive: ${codeInattive.length}`);
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
            }
            else {
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
            }
            else {
                logger.info('Nessuna coda inattiva trovata');
            }
            return { codeAttive, codeInattive };
        }
        catch (error) {
            logger.error('Errore durante il recupero dello stato delle code:', error);
            return null;
        }
    });
}
