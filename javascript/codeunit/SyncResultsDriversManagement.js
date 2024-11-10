var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import api from '../config/axiosConfig.js';
import { v4 as uuidv4 } from 'uuid';
export function fetchAndInsertResults(session, currentSeasonId, numeroRound) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!currentSeasonId) {
            return;
        }
        // Logica per inserire i risultati della sessione
        const risultatiResponse = yield fetch(`https://api.motogp.pulselive.com/motogp/v1/results/session/${session.id}/classification`);
        const risultatiData = yield risultatiResponse.json();
        const risultati = risultatiData.classification || [];
        const results_racesessionresults = yield api.get(`/races/race-sessions-results?championship_id=${currentSeasonId}&round=${numeroRound}`);
        console.log('----------------------------------------------------------------------------------');
        console.log('Risultati ottenuti per le gare:', currentSeasonId, numeroRound);
        yield new Promise(resolve => setTimeout(resolve, 10000));
        for (const risultato of risultati) {
            console.log(`Rider Name : ${risultato.rider.number} ${currentSeasonId}`);
            const driver = yield api.get(`/drivers/driver-by-number?driverNumber=${risultato.rider.number}&championshipId=${currentSeasonId}`);
            if (driver.data) {
                yield insertResultsDriver(driver.data.id, risultato, session, results_racesessionresults.data);
            }
            //TODO: sara da aggiungere il pilota
        }
    });
}
export function insertResultsDriver(driverId, risultato, session, race_sessions_results) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(session.type === 'FP' || session.type === 'PR' || session.type === 'Q' || session.type === 'Q')) {
            return;
        }
        if (session.type === 'Q' && session.number === 1) {
            return;
        }
        if (!race_sessions_results || !Array.isArray(race_sessions_results.race_sessions)) {
            console.error('race_sessions_results o race_sessions non sono definiti o non sono un array');
            return;
        }
        //prendo l'ultima sessione senza result ( prendo l'array race_sessions_results.race_sessions e filtro per resultsInserted false e prendo l'id della prima sessione)
        const sessionId = race_sessions_results.race_sessions[race_sessions_results.race_sessions.length - 1].id;
        if (!sessionId) {
            return; // Handle case where session does not exist
        }
        const resultId = uuidv4();
        //devo creare prima results e poi result_drivers
        try {
            const result = yield api.put('/results', {
                id: resultId,
                created_at: new Date().toISOString(),
                deleted_at: null,
                last_modified_at: new Date().toISOString(),
                points: risultato.points,
                pole: false,
                position: risultato.position,
                race_session_id: sessionId,
                retired: risultato.status === 'INSTND' ? false : true,
                updated_at: new Date().toISOString(),
                synchronized: false
            });
            //creo result_drivers
            const result_driver = yield api.put('/result_drivers', {
                id: uuidv4(),
                result_id: resultId,
                driver_id: driverId,
            });
        }
        catch (error) {
            console.error(error);
        }
        console.log('inserito pilota');
    });
}
//creare una funzione che in base alla data di oggi usando questa variabile  const oggi = new Date('2024-11-04'); // const oggi = new Date(); // Usa questa riga per tornare alla data attuale deve prendere la data del giovedi e del lunedi e restituirle come un oggetto con due date
export function getThursdayAndMondayDates(oggi) {
    const dayOfWeek = oggi.getDay();
    let thursday;
    let monday;
    if (dayOfWeek === 1) { // Se oggi è lunedì
        thursday = new Date(oggi);
        thursday.setDate(oggi.getDate() - 3); // Giovedì della settimana precedente
        thursday.setHours(0, 0, 0, 0);
        monday = new Date(oggi); // Restituisce il lunedì corrente
        monday.setHours(23, 59, 59, 999);
    }
    else { // Da martedì a domenica
        thursday = new Date(oggi);
        thursday.setDate(oggi.getDate() + (4 - dayOfWeek + 7) % 7); // Giovedì della settimana corrente
        thursday.setHours(0, 0, 0, 0);
        monday = new Date(thursday);
        monday.setDate(thursday.getDate() + 3); // Lunedì della prossima settimana
        monday.setHours(23, 59, 59, 999);
    }
    return { thursday, monday };
}
