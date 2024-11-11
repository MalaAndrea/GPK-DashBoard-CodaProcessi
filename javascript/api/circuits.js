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
    try {
        // Se non è fornito un championshipId, restituisci tutti i circuiti
        const { id } = req.query;
        let query = supabase.from('circuits').select('*');
        if (id) {
            query = query.eq('id', id);
        }
        const { data: circuits, error: circuitsError } = yield query;
        if (circuitsError) {
            console.error(circuitsError);
            return res.status(500).send(circuitsError.message);
        }
        // Aggiunta di controllo per restituire un oggetto vuoto se non ci sono circuiti
        if (!circuits || circuits.length === 0) {
            return res.status(200).json(null);
        }
        return res.status(200).json(circuits);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Errore del server');
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newCircuit = req.body;
    const { data, error } = yield supabase
        .from('circuits')
        .insert(newCircuit)
        .single();
    if (error) {
        console.error('Circuit insert error:', error);
        return res.status(500).send(error.message);
    }
    res.status(200).json(data);
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updatedCircuit = Object.assign(Object.assign({}, req.body), { synchronized: false });
    const { data, error } = yield supabase
        .from('circuits')
        .update(updatedCircuit)
        .eq('id', id)
        .select();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
}));
// Nuova rotta per la sincronizzazione di un driver
router.post('/sync/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { data, error } = yield supabase
        .from('circuits')
        .update({ synchronized: true })
        .eq('id', id)
        .select();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { data, error } = yield supabase
        .from('circuits')
        .update({ deleted_at: new Date(), synchronized: false }) // Imposta deleted_at alla data attuale e synchronized a false
        .eq('id', id)
        .select();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
}));
export default router;
//# sourceMappingURL=circuits.js.map