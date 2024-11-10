import { Router } from 'express';
import { supabase } from '../config/config.js';
import { TablesInsert } from '../lib/database.types';
import { Tables } from '../lib/database.types.js';

const router: Router = Router();


type Circuit = Tables<'circuits'>;

router.get('/', async (req: any, res: any) => {

    try {
        // Se non è fornito un championshipId, restituisci tutti i circuiti
        const { id } = req.query;
        let query = supabase.from('circuits').select('*');

        if (id) {
            query = query.eq('id', id);
        }

        const { data: circuits, error: circuitsError } = await query;

        if (circuitsError) {
            console.error(circuitsError);
            return res.status(500).send(circuitsError.message);
        }

        return res.status(200).json(circuits);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Errore del server');
    }
});

router.post('/', async (req: any, res: any) => {
    const newCircuit = req.body;

    const { data, error } = await supabase
        .from('circuits')
        .insert(newCircuit)
        .single();

    if (error) {
        console.error('Circuit insert error:', error);
        return res.status(500).send(error.message);
    }

    res.status(200).json(data);
});

router.put('/:id', async (req: any, res: any) => {
    const { id } = req.params;
    const updatedCircuit: Partial<Circuit> = { ...req.body, synchronized: false };
    const { data, error } = await supabase
        .from('circuits')
        .update(updatedCircuit)
        .eq('id', id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
});

// Nuova rotta per la sincronizzazione di un driver
router.post('/sync/:id', async (req: any, res: any) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('circuits')
        .update({ synchronized: true })
        .eq('id', id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('circuits')
        .update({ deleted_at: new Date(), synchronized: false }) // Imposta deleted_at alla data attuale e synchronized a false
        .eq('id', id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
});


export default router;
