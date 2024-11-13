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
    const { iso3, iso2 } = req.query;
    let query = supabase
        .schema('public')
        .from('countries')
        .select('*');
    if (iso3) {
        query = query.eq('iso3_api', iso3)
            .limit(1);
    }
    if (iso2) {
        query = query.eq('iso2', iso2)
            .limit(1);
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
router.put('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const country = req.body;
    const { data, error } = yield supabase
        .from('countries')
        .update(country)
        .eq('id', country.id);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(201).json(data);
}));
export default router;
//# sourceMappingURL=countries.js.map