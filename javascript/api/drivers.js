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
// Lettura della lista di driver per un campionato specifico e stagione 2024
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { championshipId, id } = req.query;
    let query = supabase.from('drivers').select('*').is('deleted_at', null);
    if (id) {
        // Se è fornito un ID, recupera il pilota specifico
        const { data, error } = yield supabase
            .from('drivers')
            .select(`
                *,
                team_season_drivers (
                    id,
                    number,
                    team_id,
                    championship_id,
                    season_id,
                    api_id,
                    deleted_at
                )
            `)
            .eq('id', id)
            .is('deleted_at', null);
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        // Se non viene trovato il pilota, restituisci un errore 404
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Driver not found' });
        }
        return res.status(200).json(data[0]); // Restituisci solo il pilota specifico
    }
    else if (championshipId) {
        const { data, error } = yield supabase
            .from('team_season_drivers')
            .select(`
                driver_id,
                drivers (*)
            `)
            .eq('championship_id', championshipId)
            .is('deleted_at', null);
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        // Filtra i piloti unici
        const uniqueDrivers = Array.from(new Set(data === null || data === void 0 ? void 0 : data.map(item => { var _a; return (_a = item.drivers) === null || _a === void 0 ? void 0 : _a.id; })))
            .map(id => { var _a; return (_a = data === null || data === void 0 ? void 0 : data.find(item => { var _a; return ((_a = item.drivers) === null || _a === void 0 ? void 0 : _a.id) === id; })) === null || _a === void 0 ? void 0 : _a.drivers; })
            .filter(driver => driver !== undefined); // Filtro per rimuovere eventuali undefined
        return res.status(200).json(uniqueDrivers);
    }
    else {
        const { data, error } = yield query;
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json(data);
    }
}));
// Inserimento di un nuovo driver
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newDriver = req.body;
    const { data, error } = yield supabase
        .from('drivers')
        .insert(newDriver)
        .select();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(201).json(data);
}));
// Creazione di una chiamata che dato il numero di gara restituisca il driver
router.get('/driver-by-number', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { driverNumber, championshipId } = req.query;
    if (!driverNumber || !championshipId) {
        return res.status(400).json({ error: 'driverNumber and championshipId are required' });
    }
    const { data, error } = yield supabase
        .from('team_season_drivers')
        .select(`
            driver_id,
            drivers (*)
        `)
        .eq('championship_id', championshipId)
        .eq('season_id', 2024) // Filtra per la stagione 2024
        .eq('number', driverNumber) // Filtra per il numero di gara
        .is('deleted_at', null);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    // Se non viene trovato il pilota, restituisci un errore 404
    if (!data || data.length === 0) {
        return res.status(404).json({ error: 'Driver not found' });
    }
    return res.status(200).json(data[0].drivers); // Restituisci solo il pilota specifico
}));
router.get('/teamseasondriver-by-number', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { driverNumber, championshipId } = req.query;
    if (!driverNumber || !championshipId) {
        return res.status(400).json({ error: 'driverNumber and championshipId are required' });
    }
    const { data, error } = yield supabase
        .from('team_season_drivers')
        .select(`
            *,
            drivers (*)
        `)
        .eq('championship_id', championshipId)
        .eq('season_id', 2024) // Filtra per la stagione 2024
        .eq('number', driverNumber) // Filtra per il numero di gara
        .is('deleted_at', null);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    // Se non viene trovato il pilota, restituisci null invece di un errore 404
    if (!data || data.length === 0) {
        return res.status(200).json(null); // Restituisci null
    }
    return res.status(200).json(data[0]); // Restituisci solo il pilota specifico
}));
export default router;
//# sourceMappingURL=drivers.js.map