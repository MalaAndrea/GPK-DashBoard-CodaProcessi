import { Router } from 'express';
import { supabase } from '../config/config.js';

const router: Router = Router();

// Funzione per ottenere tutte le code o una coda specifica per ID
router.get('/', async (req: any, res: any) => {
    const { id } = req.query; // Ottieni l'ID dalla query string
    let query = supabase.schema('dashboard').from('process_queue').select('*');

    if (id) {
        query = query.eq('id', id);
    }

    const { data, error } = await query;

    if (error) {
        return res.status(500).json({ error: `Errore nel recupero delle code: ${error.message}` });
    }
    return res.status(200).json(data);
});

// Funzione per aggiungere una nuova coda
router.post('/', async (req: any, res: any) => {
    const newQueue = req.body;
    const { data, error } = await supabase
        .schema('dashboard')
        .from('process_queue')
        .insert(newQueue);

    if (error) {
        return res.status(500).json({ error: `Errore nell'aggiunta della coda: ${error.message}` });
    }
    return res.status(201).json(data);
});

// Funzione per aggiornare una coda esistente
router.put('/:id', async (req: any, res: any) => {
    const { id } = req.params;
    const updatedQueue = req.body;
    const { data, error } = await supabase
        .schema('dashboard')
        .from('process_queue')
        .update(updatedQueue)
        .eq('id', id);

    if (error) {
        return res.status(500).json({ error: `Errore nell'aggiornamento della coda: ${error.message}` });
    }
    return res.status(200).json(data);
});

// Funzione per eliminare una coda
router.delete('/:id', async (req: any, res: any) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .schema('dashboard')
        .from('process_queue')
        .delete()
        .eq('id', id);

    if (error) {
        return res.status(500).json({ error: `Errore nell'eliminazione della coda: ${error.message}` });
    }
    return res.status(200).json(data);
});

// Funzione per ottenere una coda specifica per ID
router.get('/:id', async (req: any, res: any) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .schema('dashboard')
        .from('process_queue')
        .select('*')
        .eq('id', id);

    if (error) {
        return res.status(500).json({ error: `Errore nel recupero della coda: ${error.message}` });
    }
    return res.status(200).json(data);
});

export default router;