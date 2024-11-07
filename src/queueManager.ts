import { supabase } from './config/config.js';
import Queue from 'bull';
import { processQueueItem } from './queueProcessors.js';
import { Tables } from './lib/database.types';

const redisUrl = 'redis://127.0.0.1:6379';

type ProcessQueue = Tables<{ schema: 'dashboard' }, 'process_queue'>;

async function initializeSingleQueue(item: ProcessQueue) {
    if (item.interval_minutes === null || !item.active) {
        console.error(`Coda ${item.id} non inizializzata: interval_minutes non impostato o coda non attiva`);
        return;
    }

    const queue = new Queue(item.id, redisUrl);

    queue.process(async job => {
        const now = new Date();
        const lastRun = item.last_run ? new Date(item.last_run) : null;
        const intervalMinutes = item.interval_minutes;

        if (!lastRun || (intervalMinutes && (now.getTime() - lastRun.getTime()) >= intervalMinutes * 60 * 1000)) {
            await processQueueItem(item);
        }
    });

    const delay = item.interval_minutes * 60 * 1000;
    queue.add({}, { repeat: { every: delay } });

    console.log(`Coda inizializzata per ${item.interface_type}: ${item.id}`);
}

async function removeQueue(queueId: string) {
    const queue = new Queue(queueId, redisUrl);
    await queue.close();
    console.log(`Coda rimossa: ${queueId}`);
}


export async function initializeQueues() {
    const { data: queueItems, error } = await supabase
        .schema('dashboard')
        .from('process_queue')
        .select('*')
        .eq('active', true);

    if (error) {
        console.error('Errore nel recupero delle code:', error);
        return;
    }

    queueItems.forEach((item: ProcessQueue) => {
        if (item.interval_minutes === null) {
            console.error(`Coda ${item.id} non inizializzata: interval_minutes non impostato`);
            return;
        }

        const queue = new Queue(item.id, redisUrl);

        queue.process(async job => {
            const now = new Date();
            const lastRun = item.last_run ? new Date(item.last_run) : null;
            const intervalMinutes = item.interval_minutes;

            if (!lastRun || (intervalMinutes && (now.getTime() - lastRun.getTime()) >= intervalMinutes * 60 * 1000)) {
                await processQueueItem(item);
            }
        });

        const delay = item.interval_minutes * 60 * 1000;
        queue.add({}, { repeat: { every: delay } });

        console.log(`Coda inizializzata per ${item.interface_type}: ${item.id}`);
    });
}

export { initializeSingleQueue, removeQueue };