// src/app.ts
import dotenv from 'dotenv';
import { initializeQueues } from './queueManager.js';
import { setupSupabaseHooks } from './supabaseHooks.js';
import { logger } from './services/logger.js';
import { verificaConnessioneSupabase, ottieniStatoCoda } from './config/config.js';

// Carica le variabili d'ambiente
dotenv.config({ path: '.env.development' });

async function bootstrap() {
    try {
        // Verifica la connessione a Supabase
        const connessioneOk = await verificaConnessioneSupabase();
        if (!connessioneOk) {
            throw new Error('Impossibile connettersi a Supabase');
        }

        // Ottieni e logga lo stato delle code
        await ottieniStatoCoda();

        // Inizializza le code
        await initializeQueues();
        logger.info('Sistema code inizializzato');

        // Configura gli hook Supabase
        setupSupabaseHooks();
        logger.info('Hook Supabase configurati');

    } catch (error) {
        logger.error('Errore fatale durante l\'inizializzazione:', error);
        process.exit(1);
    }
}

bootstrap();