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
    const { race_id } = req.query;
    console.log('race_id:', race_id);
    if (!race_id) {
        return res.status(400).send('race ID is required');
    }
    const { data, error } = yield supabase
        .from('race_sessions')
        .select('*')
        .order('round', { ascending: true })
        .eq('race_id', race_id);
    if (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
    else {
        res.status(200).json(data);
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newRaceSession = req.body;
    const { data, error } = yield supabase
        .from('race_sessions')
        .insert(newRaceSession)
        .single();
    if (error) {
        console.error('Race session insert error:', error);
        return res.status(500).send(error.message);
    }
    res.status(200).json(data);
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updatedRaceSession = Object.assign(Object.assign({}, req.body), { synchronized: false });
    const { data, error } = yield supabase
        .from('race_sessions')
        .update(updatedRaceSession)
        .eq('id', id)
        .select();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
}));
export default router;
//# sourceMappingURL=racesessions.js.map