import { Router } from 'express';
import { supabase } from '../config/config.js';

const router: Router = Router();

router.get('/', async (req, res) => {
    const { driver_id } = req.query;
    
    let query = supabase
        .from('team_season_drivers')
        .select('*')
        .eq('season_id', 2024)
        .is('deleted_at', null);

    
    if (driver_id) {
        query = query.eq('driver_id', driver_id);
    }

    const { data, error } = await query;

    if (error) {
        console.error(error);
        res.status(500).send(error.message);
    } else {
        res.status(200).json(data);
    }
});

// Modifica di un team_season_drivers esistente
router.put('/:id', async (req: any, res: any) => {
    const { id } = req.params;
    const updatedDriver = { ...req.body, synchronized: false };
    const { data, error } = await supabase
        .from('team_season_drivers')
        .update(updatedDriver)
        .eq('id', id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
});

// Eliminazione di un team_season_drivers (soft delete)
router.delete('/:id', async (req: any, res: any) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('team_season_drivers')
        .update({ deleted_at: new Date() })
        .eq('id', id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
});

// Inserimento di un nuovo team_season_driver
router.post('/', async (req: any, res: any) => {
    const newDriver = { ...req.body, synchronized: false };
    const { data, error } = await supabase
        .from('team_season_drivers')
        .insert(newDriver)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(201).json(data);
});

export default router;
