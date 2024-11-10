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
import Queue from 'bull';
import { processQueueItem } from './queueProcessors.js';
const redisUrl = 'redis://127.0.0.1:6379';
function initializeSingleQueue(item) {
    return __awaiter(this, void 0, void 0, function* () {
        if (item.interval_minutes === null || !item.active) {
            console.error(`Coda ${item.id} non inizializzata: interval_minutes non impostato o coda non attiva`);
            return;
        }
        const queue = new Queue(item.id, redisUrl);
        queue.process((job) => __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const lastRun = item.last_run ? new Date(item.last_run) : null;
            const intervalMinutes = item.interval_minutes;
            if (!lastRun || (intervalMinutes && (now.getTime() - lastRun.getTime()) >= intervalMinutes * 60 * 1000)) {
                yield processQueueItem(item);
            }
        }));
        const delay = item.interval_minutes * 60 * 1000;
        queue.add({}, { repeat: { every: delay } });
        console.log(`Coda inizializzata per ${item.interface_type}: ${item.id}`);
    });
}
function removeQueue(queueId) {
    return __awaiter(this, void 0, void 0, function* () {
        const queue = new Queue(queueId, redisUrl);
        yield queue.close();
        console.log(`Coda rimossa: ${queueId}`);
    });
}
export function initializeQueues() {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: queueItems, error } = yield supabase
            .schema('dashboard')
            .from('process_queue')
            .select('*')
            .eq('active', true);
        if (error) {
            console.error('Errore nel recupero delle code:', error);
            return;
        }
        queueItems.forEach((item) => {
            if (item.interval_minutes === null) {
                console.error(`Coda ${item.id} non inizializzata: interval_minutes non impostato`);
                return;
            }
            const queue = new Queue(item.id, redisUrl);
            queue.process((job) => __awaiter(this, void 0, void 0, function* () {
                const now = new Date();
                const lastRun = item.last_run ? new Date(item.last_run) : null;
                const intervalMinutes = item.interval_minutes;
                if (!lastRun || (intervalMinutes && (now.getTime() - lastRun.getTime()) >= intervalMinutes * 60 * 1000)) {
                    yield processQueueItem(item);
                }
            }));
            const delay = item.interval_minutes * 60 * 1000;
            queue.add({}, { repeat: { every: delay } });
            console.log(`Coda inizializzata per ${item.interface_type}: ${item.id}`);
        });
    });
}
export { initializeSingleQueue, removeQueue };
//# sourceMappingURL=queueManager.js.map