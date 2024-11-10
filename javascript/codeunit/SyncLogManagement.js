var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import api from './../config/axiosConfig.js';
export function insertLogDriverSync(driverId) {
    return __awaiter(this, void 0, void 0, function* () {
        const driverResponse = yield api.get(`/drivers?id=${driverId}`, {
            headers: { 'X-Database': 'staging' }
        });
        const _a = driverResponse.data, { team_season_drivers } = _a, driver = __rest(_a, ["team_season_drivers"]);
        //da capire se il driver è già presente nel database produzione e se esiste sync_type = modify
        const driverExists = yield api.get(`/prod/drivers?id=${driver.id}`, {
            headers: { 'X-Database': 'produzione' }
        });
        let sync_type = 'insert';
        if (driverExists && driverExists.data) {
            sync_type = 'modify';
        }
        const nextId = yield getNextAvailableId();
        const logEntry = {
            id: nextId,
            code: 'DRIVER',
            description: `Sync log for driver: ${driver.name} ${driver.surname}`,
            record_type: 'drivers',
            record_id: driver.id,
            json_object: { driver },
            sync_type: sync_type,
            sync_status: 'pending',
            error_description: null
        };
        yield insertLog(logEntry);
        return logEntry.id;
    });
}
//funzione per aggiornare il log con l'errore
function updateLogError(id, description) {
    return __awaiter(this, void 0, void 0, function* () {
        yield api.put(`/dashboard/syncLog/${id}`, { sync_status: 'error', error_description: description });
        throw new Error(description);
    });
}
// Funzione  per l'inserimento nel database
function insertLog(log) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield api.post('/dashboard/syncLog', log);
            console.log('Log inserito:', log);
        }
        catch (error) {
            console.error('Errore durante l\'inserimento del log:', error);
            throw new Error('Failed to insert log');
        }
    });
}
// Funzione per ottenere il prossimo ID disponibile
export function getNextAvailableId() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield api.get('/dashboard/syncLog/nextId');
            return response.data.nextId;
        }
        catch (error) {
            console.error('Errore durante il recupero del prossimo ID:', error);
            throw new Error('Failed to get next available ID');
        }
    });
}
