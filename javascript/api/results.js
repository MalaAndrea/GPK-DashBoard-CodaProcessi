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
    const { race_session_id, id } = req.query;
    console.log('race_session_id:', race_session_id);
    console.log('id:', id);
    if (!race_session_id && !id) {
        return res.status(400).send('È richiesto race_session_id o id');
    }
    let query = supabase
        .from('results')
        .select(`
            *,
            result_drivers!inner (
                *,
                team_season_drivers!inner (
                    *,
                    drivers!inner (*)
                )
            )
        `)
        .is('deleted_at', null)
        .is('result_drivers.deleted_at', null)
        .is('result_drivers.team_season_drivers.deleted_at', null)
        .is('result_drivers.team_season_drivers.drivers.deleted_at', null);
    if (race_session_id) {
        query = query.eq('race_session_id', race_session_id).order('position', { ascending: true });
    }
    else if (id) {
        query = query.eq('id', id);
    }
    const { data, error } = yield query;
    if (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
    else {
        res.status(200).json(data);
    }
}));
// Inserimento di un nuovo risultato
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, race_session_id, position, points, pole, retired } = req.body;
    const { data, error } = yield supabase
        .from('results')
        .insert([{
            id,
            race_session_id,
            position,
            points,
            pole,
            retired
        }]);
    if (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
    else {
        res.status(201).json(data);
    }
}));
// Modifica di un risultato esistente
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { position, points, pole, retired, race_session_id, synchronized } = req.body;
    // Crea un oggetto con solo i campi forniti
    const updateFields = {};
    if (position !== undefined)
        updateFields.position = position;
    if (points !== undefined)
        updateFields.points = points;
    if (pole !== undefined)
        updateFields.pole = pole;
    if (retired !== undefined)
        updateFields.retired = retired;
    if (race_session_id !== undefined)
        updateFields.race_session_id = race_session_id;
    if (synchronized !== undefined)
        updateFields.synchronized = synchronized;
    const { data, error } = yield supabase
        .from('results')
        .update(updateFields)
        .eq('id', id);
    if (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
    else {
        res.status(200).json(data);
    }
}));
// Eliminazione di un risultato
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { data, error } = yield supabase
        .from('results')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);
    if (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
    else {
        res.status(200).json({ message: 'Risultato contrassegnato come eliminato con successo' });
    }
}));
export default router;
