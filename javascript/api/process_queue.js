var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from 'express';
import { supabase } from '../config/config.js';
const router = Router();
// Funzione per ottenere tutte le code o una coda specifica per ID
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query; // Ottieni l'ID dalla query string
    let query = supabase.schema('dashboard').from('process_queue').select('*');
    if (id) {
        query = query.eq('id', id);
    }
    const { data, error } = yield query;
    if (error) {
        return res.status(500).json({ error: `Errore nel recupero delle code: ${error.message}` });
    }
    return res.status(200).json(data);
}));
// Funzione per aggiungere una nuova coda
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newQueue = req.body;
    const { data, error } = yield supabase
        .schema('dashboard')
        .from('process_queue')
        .insert(newQueue);
    if (error) {
        return res.status(500).json({ error: `Errore nell'aggiunta della coda: ${error.message}` });
    }
    return res.status(201).json(data);
}));
// Funzione per aggiornare una coda esistente
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updatedQueue = req.body;
    const { data, error } = yield supabase
        .schema('dashboard')
        .from('process_queue')
        .update(updatedQueue)
        .eq('id', id);
    if (error) {
        return res.status(500).json({ error: `Errore nell'aggiornamento della coda: ${error.message}` });
    }
    return res.status(200).json(data);
}));
// Funzione per eliminare una coda
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { data, error } = yield supabase
        .schema('dashboard')
        .from('process_queue')
        .delete()
        .eq('id', id);
    if (error) {
        return res.status(500).json({ error: `Errore nell'eliminazione della coda: ${error.message}` });
    }
    return res.status(200).json(data);
}));
// Funzione per ottenere una coda specifica per ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { data, error } = yield supabase
        .schema('dashboard')
        .from('process_queue')
        .select('*')
        .eq('id', id);
    if (error) {
        return res.status(500).json({ error: `Errore nel recupero della coda: ${error.message}` });
    }
    return res.status(200).json(data);
}));
export default router;
