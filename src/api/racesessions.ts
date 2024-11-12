import { Router } from 'express';
import { supabase } from '../config/config.js';
import { Tables } from '../lib/database.types.js';

const router: Router = Router();

type RaceSession = Tables<'race_sessions'>;

router.get('/', async (req: any, res: any) => {
    const { race_id } = req.query;
    console.log('race_id:', race_id);

    if (!race_id) {
        return res.status(400).send('race ID is required');
    }

    const { data, error } = await supabase
        .from('race_sessions')
        .select('*')
        .order('round', { ascending: true })
        .eq('race_id', race_id);

    if (error) {
        console.error(error);
        res.status(500).send(error.message);
    } else {
        res.status(200).json(data);
    }
});

router.post('/', async (req: any, res: any) => {
    const newRaceSession = req.body;

    // Verifica se ci sono campi richiesti mancanti
    const missingFields = [];
    if (!newRaceSession.race_id) missingFields.push('race_id');
    if (!newRaceSession.name) missingFields.push('name');
    if (!newRaceSession.date) missingFields.push('date');
    if (!newRaceSession.round) missingFields.push('round');

    if (missingFields.length > 0) {
        console.log('Missing required fields:', missingFields.join(', '));
        return res.status(400).send('Missing required fields: ' + missingFields.join(', '));
    }

    const { data, error } = await supabase
        .from('race_sessions')
        .insert(newRaceSession)
        .single();

    if (error) {
        console.error('Race session insert error:', error);
        return res.status(500).send(error.message);
    }

    res.status(200).json(data);
});

router.put('/:id', async (req: any, res: any) => {
    const { id } = req.params;
    const updatedRaceSession: Partial<RaceSession> = { ...req.body, synchronized: false };
    const { data, error } = await supabase
        .from('race_sessions')
        .update(updatedRaceSession)
        .eq('id', id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
});

export default router;