var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { supabase } from './config/config.js';
import { processPulseliveResult } from './interfaces/pulseliveResult.js';
import { processPulseliveSession } from './interfaces/pulseliveSession.js';
export function processQueueItem(item) {
    return __awaiter(this, void 0, void 0, function* () {
        const now = new Date();
        try {
            if (item.interval_minutes === null) {
                throw new Error('interval_minutes non impostato');
            }
            switch (item.interface_type) {
                case 'pulselive_result':
                    yield processPulseliveResult(item);
                    break;
                case 'pulselive_session':
                    yield processPulseliveSession(item);
                    break;
                default:
                    throw new Error(`Tipo di interfaccia non supportato: ${item.interface_type}`);
            }
        }
        catch (error) {
            console.error(`Errore nell'elaborazione della coda ${item.id}:`, error);
            // Registra l'errore nel log
            yield supabase
                .schema('dashboard')
                .from('queue_log')
                .insert({
                queue_id: item.id,
                log_type: 'ERROR',
                error_message: error instanceof Error ? error.message : 'Errore sconosciuto',
                error_stack: error instanceof Error ? error.stack : undefined
            });
            // Disattiva la coda se interval_minutes è null
            if (item.interval_minutes === null) {
                yield supabase
                    .schema('dashboard')
                    .from('process_queue')
                    .update({ active: false })
                    .eq('id', item.id);
            }
        }
        finally {
            // Aggiorna sempre last_run, anche in caso di errore
            yield supabase
                .schema('dashboard')
                .from('process_queue')
                .update({ last_run: now.toISOString() })
                .eq('id', item.id);
        }
    });
}
//# sourceMappingURL=queueProcessors.js.map