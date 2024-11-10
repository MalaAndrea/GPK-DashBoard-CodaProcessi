var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from 'dotenv';
import { initializeQueues } from './queueManager.js';
import { setupSupabaseHooks } from './supabaseHooks.js';
import { logger } from './services/logger.js';
import { verificaConnessioneSupabase, ottieniStatoCoda } from './config/config.js';
import express from 'express';
import apiRoutes from './api/apiRoutes.js';
// Carica le variabili d'ambiente
dotenv.config({ path: '.env.development' });
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verifica la connessione a Supabase
            const connessioneOk = yield verificaConnessioneSupabase();
            if (!connessioneOk) {
                throw new Error('Impossibile connettersi a Supabase');
            }
            // Ottieni e logga lo stato delle code
            yield ottieniStatoCoda();
            // Inizializza le code
            yield initializeQueues();
            logger.info('Sistema code inizializzato');
            // Configura gli hook Supabase
            setupSupabaseHooks();
            logger.info('Hook Supabase configurati');
            const app = express();
            const PORT = process.env.PORT || 3000;
            // Middleware per il parsing del corpo delle richieste
            app.use(express.json());
            // Utilizza le rotte API
            app.use('/api', apiRoutes);
            // Gestione degli errori
            app.use((err, req, res, next) => {
                logger.error(err.message); // Logga l'errore
                res.status(500).json({ error: 'Internal Server Error' });
            });
            // Avvio del server
            app.listen(PORT, () => {
                console.log(`Server in ascolto sulla porta ${PORT}`);
            });
        }
        catch (error) {
            logger.error('Errore fatale durante l\'inizializzazione:', error);
            process.exit(1);
        }
    });
}
bootstrap();
