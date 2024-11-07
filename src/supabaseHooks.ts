import { supabase } from './config/config.js';
import { initializeSingleQueue, removeQueue } from './queueManager.js';

export function setupSupabaseHooks() {
  supabase
    .channel('process_queue_changes')
    .on('postgres_changes', { event: 'INSERT', schema: 'dashboard', table: 'process_queue' }, handleInsert)
    .on('postgres_changes', { event: 'UPDATE', schema: 'dashboard', table: 'process_queue' }, handleUpdate)
    .on('postgres_changes', { event: 'DELETE', schema: 'dashboard', table: 'process_queue' }, handleDelete)
    .subscribe();
}

async function handleInsert(payload: any) {
  const newQueue = payload.new;
  await initializeSingleQueue(newQueue);
}

async function handleUpdate(payload: any) {
  const updatedQueue = payload.new;
  const oldQueue = payload.old;

  if (updatedQueue.active && !oldQueue.active) {
    await initializeSingleQueue(updatedQueue);
  } else if (!updatedQueue.active && oldQueue.active) {
    await removeQueue(updatedQueue.id);
  }
}

async function handleDelete(payload: any) {
  const deletedQueue = payload.old;
  await removeQueue(deletedQueue.id);
}