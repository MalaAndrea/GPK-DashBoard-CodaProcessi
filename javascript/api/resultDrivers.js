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
// Ottenere tutti i result_drivers o uno specifico per id
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    let query = supabase
        .from('result_drivers')
        .select('*')
        .is('deleted_at', null);
    if (id) {
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
// Inserimento di un nuovo result_driver
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { result_id, team_season_drivers_id, synchronized } = req.body;
    const { data, error } = yield supabase
        .from('result_drivers')
        .insert([{
            result_id,
            team_season_drivers_id,
            synchronized
        }]);
    if (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
    else {
        res.status(201).json(data);
    }
}));
// Modifica di un result_driver esistente
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { result_id, team_season_drivers_id, synchronized } = req.body;
    const { data, error } = yield supabase
        .from('result_drivers')
        .update({ result_id, team_season_drivers_id, synchronized })
        .eq('id', id);
    if (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
    else {
        res.status(200).json(data);
    }
}));
// Eliminazione di un result_driver
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { data, error } = yield supabase
        .from('result_drivers')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);
    if (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
    else {
        res.status(200).json({ message: 'Result driver contrassegnato come eliminato con successo' });
    }
}));
export default router;
