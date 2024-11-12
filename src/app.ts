import dotenv from 'dotenv';
import { initializeQueues } from './queueManager.js';
import { setupSupabaseHooks } from './supabaseHooks.js';
import { logger } from './services/logger.js';
import { verificaConnessioneSupabase, ottieniStatoCoda } from './config/config.js';
import express from 'express';
import apiRoutes from './api/apiRoutes.js';

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

        const app = express();
        const PORT = /*process.env.PORT ||*/ 3000;

        // Middleware per il parsing del corpo delle richieste
        app.use(express.json());

        // Utilizza le rotte API
        app.use('/api', apiRoutes);

        // Gestione degli errori
        app.use((err: any, req: any, res: any, next: any) => {
            logger.error(err.message); // Logga l'errore
            res.status(500).json({ error: 'Internal Server Error' });
        });

        // Avvio del server
        app.listen(PORT, () => {
            console.log(`Server in ascolto sulla porta ${PORT}`);
        });

    } catch (error) {
        logger.error('Errore fatale durante l\'inizializzazione:', error);
        process.exit(1);
    }
}

bootstrap();