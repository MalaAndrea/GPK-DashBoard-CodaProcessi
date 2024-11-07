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
// Carica le variabili d'ambiente
dotenv.config({ path: '.env.production' });
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Inizializza le code
            yield initializeQueues();
            logger.info('Queue system initialized');
            // Configura gli hook Supabase
            setupSupabaseHooks();
            logger.info('Supabase hooks configured');
        }
        catch (error) {
            logger.error('Fatal error during initialization:', error);
            process.exit(1);
        }
    });
}
bootstrap();
