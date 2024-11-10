var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from 'express';
import { supabase } from '../config/config.js';
const router = Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { championship_id } = req.query;
    console.log('championship_id:', championship_id);
    if (!championship_id) {
        return res.status(400).send('Championship ID is required');
    }
    const { data, error } = yield supabase
        .from('races')
        .select('*')
        .order('round', { ascending: true })
        .eq('championship_id', championship_id);
    if (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
    else {
        res.status(200).json(data);
    }
}));
router.get('/race-sessions-results', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { championship_id, round } = req.query;
    console.log('championship_id:', championship_id);
    console.log('round:', round);
    if (!championship_id || !round) {
        return res.status(400).send('Championship ID and round are required');
    }
    // Esegui la query per ottenere le gare e le sessioni
    const { data: races, error: raceError } = yield supabase
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
    const resultsPromises = races.map((race) => __awaiter(void 0, void 0, void 0, function* () {
        const sessionResultsPromises = race.race_sessions.map((session) => __awaiter(void 0, void 0, void 0, function* () {
            const { data: results, error: resultsError } = yield supabase
                .from('results')
                .select('*')
                .eq('race_session_id', session.id); // Usa l'ID della sessione corrente
            if (resultsError) {
                console.error(resultsError);
                return Object.assign(Object.assign({}, session), { resultsInserted: false }); // Se c'è un errore, impostiamo a false
            }
            return Object.assign(Object.assign({}, session), { resultsInserted: results.length > 0 });
        }));
        const sessionsWithResults = yield Promise.all(sessionResultsPromises);
        return Object.assign(Object.assign({}, race), { race_sessions: sessionsWithResults }); // Restituisci la gara con le sessioni aggiornate
    }));
    const racesWithResults = yield Promise.all(resultsPromises);
    res.status(200).json(racesWithResults);
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, round } = req.body;
    if (!id || !name || round === undefined) {
        return res.status(400).send('ID, name and round are required');
    }
    const { data, error } = yield supabase
        .from('races')
        .update({ name, round })
        .eq('id', id);
    if (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
    else {
        res.status(200).json(data);
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Request Headers: ", req.headers);
    console.log("Request Body: ", req.body);
    const { championship_id, circuit_id, created_at, deleted_at, id, last_modified_at, name, round, season_id, updated_at, sessions } = req.body;
    if (!championship_id || !circuit_id || !name || round === undefined || !season_id || !sessions) {
        return res.status(400).send('championship_id, circuit_id, name, round, season_id, and sessions are required');
    }
    // Controlla se la gara esiste già
    const { data: existingRace, error: checkRaceError } = yield supabase
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
        const { data, error: raceError } = yield supabase
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
    }
    else {
        raceData = existingRace;
        console.log('Race already exists:', existingRace);
    }
    const race_id = id; // Usa l'ID della gara fornito nel body della richiesta
    const sessionsWithRaceId = sessions.map((session) => (Object.assign(Object.assign({}, session), { race_id })));
    const { data: sessionsData, error: sessionsError } = yield supabase
        .from('race_sessions')
        .insert(sessionsWithRaceId);
    if (sessionsError) {
        console.error('Sessions insert error:', sessionsError);
        return res.status(500).send(sessionsError.message);
    }
    console.log('Sessions data:', sessionsData);
    res.status(200).json({ race: existingRace || raceData, sessions: sessionsData });
}));
export default router;
