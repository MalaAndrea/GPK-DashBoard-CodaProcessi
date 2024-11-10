import { Router } from 'express';
import { supabase } from '../config/config.js';

const router: Router = Router();


// Ottenere tutti i result_drivers o uno specifico per id
router.get('/', async (req, res) => {
    const { id } = req.query;

    let query = supabase
        .from('result_drivers')
        .select('*')
        .is('deleted_at', null);

    if (id) {
        query = query.eq('id', id);
    }

    const { data, error } = await query;

    if (error) {
        console.error(error);
        res.status(500).send(error.message);
    } else {
        res.status(200).json(data);
    }
});

// Inserimento di un nuovo result_driver
router.post('/', async (req, res) => {
    const newResultDriver = req.body;

    const { data, error } = await supabase
        .from('result_drivers')
        .insert(newResultDriver);

    if (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    } else {
        res.status(201).json({ id: newResultDriver.id });
    }
});

// Modifica di un result_driver esistente
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { result_id, team_season_drivers_id, synchronized } = req.body;

    const { data, error } = await supabase
        .from('result_drivers')
        .update({ result_id, team_season_drivers_id, synchronized })
        .eq('id', id);

    if (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    } else {
        res.status(200).json(data);
    }
});

// Eliminazione di un result_driver
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('result_drivers')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

    if (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    } else {
        res.status(200).json({ message: 'Result driver contrassegnato come eliminato con successo' });
    }
});

export default router;