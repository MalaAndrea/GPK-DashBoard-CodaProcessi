import { Router } from 'express';
import { supabase } from '../config/config.js';
import { TablesInsert } from '../lib/database.types';

const router: Router = Router();


router.get('/', async (req: any, res: any) => {
    const { championship_id, round } = req.query;

    if (!championship_id) {
        return res.status(400).send('Championship ID is required');
    }

    const query = supabase
        .from('races')
        .select('*')
        .order('round', { ascending: true })
        .eq('championship_id', championship_id);

    if (round) {
        query.eq('round', round);
    }

    const { data, error } = await query;

    if (error) {
        console.error(error);
        res.status(500).send(error.message);
    } else {
        res.status(200).json(data);
    }
});

router.get('/race-sessions-results', async (req: any, res: any) => {
    const { championship_id, round } = req.query;
    console.log('championship_id:', championship_id);
    console.log('round:', round);

    if (!championship_id || !round) {
        return res.status(400).send('Championship ID and round are required');
    }

    // Esegui la query per ottenere le gare e le sessioni
    const { data: races, error: raceError } = await supabase
        .from('races')
        .select('*, race_sessions(*)') // Join con race_sessions
        .eq('championship_id', championship_id)
        .eq('round', round) // Filtra per numero di round
        .order('round', { ascending: true });

    if (raceError) {
        console.error(raceError);
        return res.status(500).send(raceError.message);
    }

    // Controlla i risultati per ogni sessione
    const resultsPromises = races.map(async (race) => {
        const sessionResultsPromises = race.race_sessions.map(async (session) => {
            const { data: results, error: resultsError } = await supabase
                .from('results')
                .select('*')
                .eq('race_session_id', session.id); // Usa l'ID della sessione corrente

            if (resultsError) {
                console.error(resultsError);
                return { ...session, resultsInserted: false }; // Se c'è un errore, impostiamo a false
            }

            return { ...session, resultsInserted: results.length > 0 }; 
        });

        const sessionsWithResults = await Promise.all(sessionResultsPromises);
        return { ...race, race_sessions: sessionsWithResults }; // Restituisci la gara con le sessioni aggiornate
    });

    const racesWithResults = await Promise.all(resultsPromises);

    res.status(200).json(racesWithResults);
});

router.put('/:id', async (req: any, res: any) => {
    const { id } = req.params;
    const { name, round } = req.body;

    if (!id || !name || round === undefined) {
        return res.status(400).send('ID, name and round are required');
    }

    const { data, error } = await supabase
        .from('races')
        .update({ name, round })
        .eq('id', id);

    if (error) {
        console.error(error);
        res.status(500).send(error.message);
    } else {
        res.status(200).json(data);
    }
});

router.post('/', async (req: any, res: any) => {
    console.log("Request Headers: ", req.headers);
    console.log("Request Body: ", req.body);

    const {
        championship_id, circuit_id, created_at, deleted_at, id,
        last_modified_at, name, round, season_id, updated_at, sessions
    } = req.body;

    if (!championship_id || !circuit_id || !name || round === undefined || !season_id || !sessions) {
        return res.status(400).send('championship_id, circuit_id, name, round, season_id, and sessions are required');
    }

    type RaceInsert = TablesInsert<'races'>;
    type RaceSessionInsert = TablesInsert<'race_sessions'>;

    // Controlla se la gara esiste già
    const { data: existingRace, error: checkRaceError } = await supabase
        .from('races')
        .select('*')
        .eq('id', id)
        .single();

    if (checkRaceError && checkRaceError.code !== 'PGRST116') { // Ignora errore di record non trovato
        console.error('Check race error:', checkRaceError);
        return res.status(500).send(checkRaceError.message);
    }

    let raceData;
    if (!existingRace) {
        const { data, error: raceError } = await supabase
            .from('races')
            .insert([{
                id, // Usa l'ID fornito nel body della richiesta
                championship_id, circuit_id, created_at, deleted_at,
                last_modified_at, name, round, season_id, updated_at
            }])
            .single();

        if (raceError) {
            console.error('Race insert error:', raceError);
            return res.status(500).send(raceError.message);
        }

        raceData = data;
        console.log('Race data:', raceData);
    } else {
        raceData = existingRace;
        console.log('Race already exists:', existingRace);
    }

    const race_id = id; // Usa l'ID della gara fornito nel body della richiesta

    const sessionsWithRaceId = sessions.map((session: Omit<RaceSessionInsert, 'race_id'>) => ({ ...session, race_id }));
    const { data: sessionsData, error: sessionsError } = await supabase
        .from('race_sessions')
        .insert(sessionsWithRaceId);

    if (sessionsError) {
        console.error('Sessions insert error:', sessionsError);
        return res.status(500).send(sessionsError.message);
    }

    console.log('Sessions data:', sessionsData);

    res.status(200).json({ race: existingRace || raceData, sessions: sessionsData });
});

export default router;
