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
// Ottenere tutti i team o un team specifico per ID
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, championshipId, name } = req.query;
    let query = supabase.from('teams').select('*').is('deleted_at', null);
    if (championshipId) {
        // Unire la tabella teams con team_season_drivers
        const { data, error } = yield supabase
            .from('team_season_drivers')
            .select(`
                team_id,
                teams (*)
            `)
            .eq('championship_id', championshipId)
            .is('deleted_at', null);
        if (error) {
            console.error(error);
            return res.status(500).send(error.message);
        }
        // Filtrare i team unici
        const uniqueTeams = Array.from(new Set(data === null || data === void 0 ? void 0 : data.map(item => { var _a; return (_a = item.teams) === null || _a === void 0 ? void 0 : _a.id; })))
            .map(id => { var _a; return (_a = data === null || data === void 0 ? void 0 : data.find(item => { var _a; return ((_a = item.teams) === null || _a === void 0 ? void 0 : _a.id) === id; })) === null || _a === void 0 ? void 0 : _a.teams; })
            .filter(team => team !== undefined); // Filtro per rimuovere eventuali undefined
        return res.status(200).json(uniqueTeams);
    }
    if (id) {
        query = query.eq('id', id);
    }
    if (name) {
        query = query.eq('name', name);
    }
    const { data, error } = yield query;
    if (error) {
        console.error(error);
        return res.status(500).send(error.message);
    }
    // Modifica per restituire null se non ci sono dati
    if (!data || data.length === 0) {
        return res.status(200).json(null); // Restituisce null se non ci sono team trovati
    }
    return res.status(200).json(data);
}));
// Inserimento di un nuovo team
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newTeam = req.body;
    const { data, error } = yield supabase
        .from('teams')
        .insert([newTeam])
        .select();
    if (error) {
        console.error(error);
        return res.status(500).send(error.message);
    }
    return res.status(201).json(newTeam);
}));
// Modifica di un team esistente
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updatedTeam = req.body;
    const { data, error } = yield supabase
        .from('teams')
        .update(updatedTeam)
        .eq('id', id)
        .select();
    if (error) {
        console.error(error);
        return res.status(500).send(error.message);
    }
    return res.status(200).json(data);
}));
// Eliminazione di un team (soft delete)
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { data, error } = yield supabase
        .from('teams')
        .update({ deleted_at: new Date() }) // Imposta deleted_at alla data attuale
        .eq('id', id)
        .select();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
}));
export default router;
//# sourceMappingURL=teams.js.map