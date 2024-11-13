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
    const { driver_id } = req.query;
    let query = supabase
        .from('team_season_drivers')
        .select('*')
        .eq('season_id', 2024)
        .is('deleted_at', null);
    if (driver_id) {
        query = query.eq('driver_id', driver_id);
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
// Modifica di un team_season_drivers esistente
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updatedDriver = Object.assign(Object.assign({}, req.body), { synchronized: false });
    const { data, error } = yield supabase
        .from('team_season_drivers')
        .update(updatedDriver)
        .eq('id', id)
        .select();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
}));
// Eliminazione di un team_season_drivers (soft delete)
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { data, error } = yield supabase
        .from('team_season_drivers')
        .update({ deleted_at: new Date() })
        .eq('id', id)
        .select();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
}));
// Inserimento di un nuovo team_season_driver
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newDriver = Object.assign(Object.assign({}, req.body), { synchronized: false });
    const { data, error } = yield supabase
        .from('team_season_drivers')
        .insert(newDriver)
        .select();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(201).json(data);
}));
export default router;
//# sourceMappingURL=teamseasondriver.js.map