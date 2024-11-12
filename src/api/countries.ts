import { Router } from 'express';
import { supabase } from '../config/config.js';
import { Tables } from '../lib/database.types.js';

const router: Router = Router();

type Country = Tables<'countries'>;

router.get('/', async (req: any, res: any) => {
    const iso3 = req.query.iso3;
    let query = supabase
        .schema('public')
        .from('countries')
        .select('*');

    if (iso3) {
        query = query.eq('iso3_api', iso3)
            .limit(1);
    }

    const { data, error } = await query;

    if (error) {
        console.error(error);
        res.status(500).send(error.message);
    } else {
        res.status(200).json(data);
    }
});

router.put('/', async (req: any, res: any) => {
    const country: Country = req.body;
    const { data, error } = await supabase
        .from('countries')
        .update(country)
        .eq('id', country.id);

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(201).json(data);
});

export default router;
