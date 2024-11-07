import { supabase } from './config/config.js';
import { processPulseliveResult } from './interfaces/pulseliveResult.js';
import { processPulseliveSession } from './interfaces/pulseliveSession.js';
import { Tables } from './lib/database.types';

type ProcessQueue = Tables<{ schema: 'dashboard' }, 'process_queue'>;

export async function processQueueItem(item: ProcessQueue) {
  const now = new Date();

  try {
    if (item.interval_minutes === null) {
      throw new Error('interval_minutes non impostato');
    }

    switch (item.interface_type) {
      case 'pulselive_result':
        await processPulseliveResult(item);
        break;
      case 'pulselive_session':
        await processPulseliveSession(item);
        break;
      default:
        throw new Error(`Tipo di interfaccia non supportato: ${item.interface_type}`);
    }

  } catch (error) {
    console.error(`Errore nell'elaborazione della coda ${item.id}:`, error);

    // Registra l'errore nel log
    await supabase
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
      await supabase
        .schema('dashboard')
        .from('process_queue')
        .update({ active: false })
        .eq('id', item.id);
    }
  } finally {
    // Aggiorna sempre last_run, anche in caso di errore
    await supabase
      .schema('dashboard')
      .from('process_queue')
      .update({ last_run: now.toISOString() })
      .eq('id', item.id);
  }
}