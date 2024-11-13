import { Router } from 'express';
import { supabase } from '../config/config.js';
import { Tables } from '../lib/database.types.js';
import exp from 'constants';

const router: Router = Router();

type Driver = Tables<'drivers'>;

// Definisci un tipo per i dati dei piloti
type DriverData = {
    drivers: {
        id: string; 
    };
};

// Lettura della lista di driver per un campionato specifico e stagione 2024
router.get('/', async (req: any, res: any) => {
    const { championshipId, id } = req.query;

    let query = supabase.from('drivers').select('*').is('deleted_at', null);

    if (id) {
        // Se è fornito un ID, recupera il pilota specifico
        const { data, error } = await supabase
            .from('drivers')
            .select(`
                *,
                team_season_drivers (
                    id,
                    number,
                    team_id,
                    championship_id,
                    season_id,
                    api_id,
                    deleted_at
                )
            `)
            .eq('id', id)
            .is('deleted_at', null);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        // Se non viene trovato il pilota, restituisci un errore 404
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Driver not found' });
        }

        return res.status(200).json(data[0]); // Restituisci solo il pilota specifico
    } else if (championshipId) {
        const { data, error } = await supabase
            .from('team_season_drivers')
            .select(`
                driver_id,
                drivers (*)
            `)
            .eq('championship_id', championshipId)
            .is('deleted_at', null) as { data: DriverData[] | null; error: any };

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        // Filtra i piloti unici
        const uniqueDrivers = Array.from(new Set(data?.map(item => item.drivers?.id)))
            .map(id => data?.find(item => item.drivers?.id === id)?.drivers)
            .filter(driver => driver !== undefined); // Filtro per rimuovere eventuali undefined

        return res.status(200).json(uniqueDrivers);
    } else {
        const { data, error } = await query;

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json(data);
    }
});

// Inserimento di un nuovo driver
router.post('/', async (req: any, res: any) => {
    const newDriver: Driver = req.body;
    const { data, error } = await supabase
        .from('drivers')
        .insert(newDriver)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(201).json(data);
});


// Creazione di una chiamata che dato il numero di gara restituisca il driver
router.get('/driver-by-number', async (req: any, res: any) => {
    const { driverNumber, championshipId } = req.query;

    if (!driverNumber || !championshipId) {
        return res.status(400).json({ error: 'driverNumber and championshipId are required' });
    }

    const { data, error } = await supabase
        .from('team_season_drivers')
        .select(`
            driver_id,
            drivers (*)
        `)
        .eq('championship_id', championshipId)
        .eq('season_id', 2024) // Filtra per la stagione 2024
        .eq('number', driverNumber) // Filtra per il numero di gara
        .is('deleted_at', null) as { data: DriverData[] | null; error: any };

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    // Se non viene trovato il pilota, restituisci un errore 404
    if (!data || data.length === 0) {
        return res.status(404).json({ error: 'Driver not found' });
    }

    return res.status(200).json(data[0].drivers); // Restituisci solo il pilota specifico
});

router.get('/teamseasondriver-by-number', async (req: any, res: any) => {
    const { driverNumber, championshipId } = req.query;

    if (!driverNumber || !championshipId) {
        return res.status(400).json({ error: 'driverNumber and championshipId are required' });
    }

    const { data, error } = await supabase
        .from('team_season_drivers')
        .select(`
            *,
            drivers (*)
        `)
        .eq('championship_id', championshipId)
        .eq('season_id', 2024) // Filtra per la stagione 2024
        .eq('number', driverNumber) // Filtra per il numero di gara
        .is('deleted_at', null) as { data: DriverData[] | null; error: any };

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    // Se non viene trovato il pilota, restituisci null invece di un errore 404
    if (!data || data.length === 0) {
        return res.status(200).json(null); // Restituisci null
    }

    return res.status(200).json(data[0]); // Restituisci solo il pilota specifico
});



export default router;
