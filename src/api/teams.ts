import { Router } from 'express';
import { supabase } from '../config/config.js';
import { Tables } from '../lib/database.types.js';

const router: Router = Router();

type Teams = Tables<'teams'>;

type TeamsData = {
    teams: {
        id: string; 
    };
};

// Ottenere tutti i team o un team specifico per ID
router.get('/', async (req: any, res: any) => {
    const { id, championshipId, name } = req.query;

    let query = supabase.from('teams').select('*').is('deleted_at', null);

    if (championshipId) {
        // Unire la tabella teams con team_season_drivers
        const { data, error } = await supabase
            .from('team_season_drivers')
            .select(`
                team_id,
                teams (*)
            `)
            .eq('championship_id', championshipId)
            .is('deleted_at', null) as { data: TeamsData[] | null; error: any };

        if (error) {
            console.error(error);
            return res.status(500).send(error.message);
        }

        // Filtrare i team unici
        const uniqueTeams = Array.from(new Set(data?.map(item => item.teams?.id)))
            .map(id => data?.find(item => item.teams?.id === id)?.teams)
            .filter(team => team !== undefined); // Filtro per rimuovere eventuali undefined

        return res.status(200).json(uniqueTeams);
    }

    if (id) {
        query = query.eq('id', id);
    }
    if (name) {
        query = query.eq('name', name);
    }

    const { data, error } = await query;

    if (error) {
        console.error(error);
        return res.status(500).send(error.message);
    }

    // Modifica per restituire null se non ci sono dati
    if (!data || data.length === 0) {
        return res.status(200).json(null); // Restituisce null se non ci sono team trovati
    }

    return res.status(200).json(data);
});

// Inserimento di un nuovo team
router.post('/', async (req: any, res: any) => {
    const newTeam = req.body;

    const { data, error } = await supabase
        .from('teams')
        .insert([newTeam])
        .select();

    if (error) {
        console.error(error);
        return res.status(500).send(error.message);
    }

    return res.status(201).json(newTeam);
});

// Modifica di un team esistente
router.put('/:id', async (req: any, res: any) => {
    const { id } = req.params;
    const updatedTeam = req.body;

    const { data, error } = await supabase
        .from('teams')
        .update(updatedTeam)
        .eq('id', id)
        .select();

    if (error) {
        console.error(error);
        return res.status(500).send(error.message);
    }

    return res.status(200).json(data);
});

// Eliminazione di un team (soft delete)
router.delete('/:id', async (req: any, res: any) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('teams')
        .update({ deleted_at: new Date() }) // Imposta deleted_at alla data attuale
        .eq('id', id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
});

export default router;
