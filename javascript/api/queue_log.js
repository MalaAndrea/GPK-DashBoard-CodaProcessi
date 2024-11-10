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
// Funzione per ottenere tutti i log della coda
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabase
        .schema('dashboard')
        .from('queue_log')
        .select('*');
    if (error) {
        return res.status(500).json({ error: `Errore nel recupero dei log: ${error.message}` });
    }
    return res.status(200).json(data);
}));
// Funzione per aggiungere un nuovo log
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newLog = req.body;
    const { data, error } = yield supabase
        .schema('dashboard')
        .from('queue_log')
        .insert(newLog);
    if (error) {
        return res.status(500).json({ error: `Errore nell'aggiunta del log: ${error.message}` });
    }
    return res.status(201).json(data);
}));
export default router;
//# sourceMappingURL=queue_log.js.map