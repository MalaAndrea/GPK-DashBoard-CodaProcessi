import fetch from 'node-fetch';
import { Tables } from './../lib/database.types';
import { supabase } from './../config/config.js';
import api from './../config/axiosConfig.js';

type ProcessQueue = Tables<{ schema: 'dashboard' }, 'process_queue'>;

export async function processPulseliveSession(item: ProcessQueue) {
  try {
    const response = await fetch(item.endpoint);
    const data = await response.json();

    // Elabora i dati e salvali nel database
    // ...

    console.log(`Elaborati i risultati per ${item.championship}`);

    // Crea un log di successo

    await api.post('/queue-log', {
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
  } catch (error) {
    console.error(`Errore nell'elaborazione dei risultati per ${item.championship}:`, error);

    // Crea un log di errore
    await supabase
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
}