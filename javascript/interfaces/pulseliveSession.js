var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fetch from 'node-fetch';
import { supabase } from './../config/config.js';
import api from './../config/axiosConfig.js';
export function processPulseliveSession(item) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(item.endpoint);
            const data = yield response.json();
            // Elabora i dati e salvali nel database
            // ...
            console.log(`Elaborati i risultati per ${item.championship}`);
            // Crea un log di successo
            yield api.post('/queue-log', {
                queue_id: item.id,
                log_type: 'UPDATED',
                error_message: null,
                error_stack: null,
            });
            /*    .schema('dashboard')
               .from('queue_log')
               .insert({
                 queue_id: item.id,
                 log_type: 'SUCCESS',
                 error_message: null,
                 error_stack: null
               }); */
        }
        catch (error) {
            console.error(`Errore nell'elaborazione dei risultati per ${item.championship}:`, error);
            // Crea un log di errore
            yield supabase
                .schema('dashboard')
                .from('queue_log')
                .insert({
                queue_id: item.id,
                log_type: 'ERROR',
                error_message: error instanceof Error ? error.message : 'Errore sconosciuto',
                error_stack: error instanceof Error ? error.stack : null
            });
            throw error; // Rilancia l'errore per gestirlo nel chiamante
        }
    });
}
