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
import { initializeSingleQueue, removeQueue } from './queueManager.js';
export function setupSupabaseHooks() {
    supabase
        .channel('process_queue_changes')
        .on('postgres_changes', { event: 'INSERT', schema: 'dashboard', table: 'process_queue' }, handleInsert)
        .on('postgres_changes', { event: 'UPDATE', schema: 'dashboard', table: 'process_queue' }, handleUpdate)
        .on('postgres_changes', { event: 'DELETE', schema: 'dashboard', table: 'process_queue' }, handleDelete)
        .subscribe();
}
function handleInsert(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const newQueue = payload.new;
        yield initializeSingleQueue(newQueue);
    });
}
function handleUpdate(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedQueue = payload.new;
        const oldQueue = payload.old;
        if (updatedQueue.active && !oldQueue.active) {
            yield initializeSingleQueue(updatedQueue);
        }
        else if (!updatedQueue.active && oldQueue.active) {
            yield removeQueue(updatedQueue.id);
        }
    });
}
function handleDelete(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const deletedQueue = payload.old;
        yield removeQueue(deletedQueue.id);
    });
}
//# sourceMappingURL=supabaseHooks.js.map