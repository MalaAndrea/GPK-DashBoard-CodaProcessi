import { Router } from 'express';
import { supabase } from '../config/config.js';

const router: Router = Router();

// Funzione per ottenere tutti i log della coda
router.get('/', async (req: any, res: any) => {
    const { data, error } = await supabase
        .schema('dashboard')
        .from('queue_log')
        .select('*');

    if (error) {
        return res.status(500).json({ error: `Errore nel recupero dei log: ${error.message}` });
    }
    return res.status(200).json(data);
});

// Funzione per aggiungere un nuovo log
router.post('/', async (req: any, res: any) => {
    const newLog = req.body;
    const { data, error } = await supabase
        .schema('dashboard')
        .from('queue_log')
        .insert(newLog);

    if (error) {
        return res.status(500).json({ error: `Errore nell'aggiunta del log: ${error.message}` });
    }
    return res.status(201).json(data);
});

export default router;