import dotenv from 'dotenv';
import { initializeQueues } from './queueManager.js';
import { setupSupabaseHooks } from './supabaseHooks.js';
import { logger } from './services/logger.js';

// Carica le variabili d'ambiente
dotenv.config({ path: '.env.production' });

async function bootstrap() {
    try {
        // Inizializza le code
        await initializeQueues();
        logger.info('Queue system initialized');

        // Configura gli hook Supabase
        setupSupabaseHooks();
        logger.info('Supabase hooks configured');

    } catch (error) {
        logger.error('Fatal error during initialization:', error);
        process.exit(1);
    }
}

bootstrap();