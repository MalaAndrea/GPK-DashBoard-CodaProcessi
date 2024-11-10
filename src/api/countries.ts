import { Router } from 'express';
import { supabase } from '../config/config.js';

const router: Router = Router();

router.get('/', async (req: any, res: any) => {
    const iso3 = req.query.iso3;
    let query = supabase.from('countries').select('*');

    if (iso3) {
        query = query.eq('iso3', iso3);
    }

    const { data, error } = await query;

    if (error) {
        console.error(error);
        res.status(500).send(error.message);
    } else {
        res.status(200).json(data);
    }
});

export default router;
