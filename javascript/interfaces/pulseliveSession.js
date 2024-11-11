var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fetch from "node-fetch";
import { supabase } from "./../config/config.js";
import api from "./../config/axiosConfig.js";
import { v4 as uuidv4 } from 'uuid';
function upsertRace(PulseLive_Event, round, championshipId) {
    return __awaiter(this, void 0, void 0, function* () {
        let raceId = null;
        if (!championshipId) {
            return null;
        }
        let circuitId = null;
        const race = yield api.get(`/races?championship_id=${championshipId}&round=${round}`);
        if (race.data.length > 0) {
            return race.data[0].id;
        }
        else {
            //da trovare prima il circuito
            let circuit = null;
            try {
                circuit = yield api.get(`/circuits?id=${PulseLive_Event.circuit.id}`);
            }
            catch (error) {
                console.error(error);
            }
            if (circuit && circuit.data) {
                circuitId = circuit.data.id;
            }
            else {
                circuitId = PulseLive_Event.circuit.id;
                const countryId = yield getCountryId(PulseLive_Event.circuit.nation);
                yield api.post(`/circuits`, {
                    id: circuitId,
                    name: PulseLive_Event.circuit.name,
                    location: PulseLive_Event.circuit.place,
                    country_id: countryId,
                    lat: 0,
                    long: 0
                });
            }
            //creo la gara 
            if (circuitId) {
                raceId = uuidv4();
                yield api.post(`/races/newRace`, {
                    id: raceId,
                    championship_id: championshipId,
                    circuit_id: circuitId,
                    season_id: 2024,
                    round: round,
                    name: PulseLive_Event.circuit.name,
                });
            }
        }
        return raceId;
    });
}
function insertSession(PulseLive_Event, raceId, championshipId) {
    return __awaiter(this, void 0, void 0, function* () {
        const sessions_pulselive = (yield api.get(`/sessions?eventUuid=${PulseLive_Event.id}&categoryUuid=${championshipId}`)).data;
        const sessions = (yield api.get(`/racesessions?race_id=${raceId}`)).data;
        let recordCount = 0;
        if (sessions_pulselive.data.length > 0) {
            for (const session of sessions) {
                recordCount++;
                const sessione_pulselive_name = sessions_pulselive[recordCount].number === 0 ? sessions_pulselive[recordCount].name : sessions_pulselive[recordCount].name + ' - ' + sessions_pulselive[recordCount].number;
                if (sessions[recordCount]) {
                    if (sessions_pulselive[recordCount].date !== sessions[recordCount].date) {
                        yield api.put(`/racesessions/${sessions[recordCount].id}`, {
                            date: sessions_pulselive[recordCount].date,
                        });
                    }
                    if (sessione_pulselive_name !== sessions[recordCount].name) {
                        yield api.put(`/racesessions/${sessions[recordCount].id}`, {
                            name: sessione_pulselive_name,
                        });
                    }
                }
                else {
                    //inserisco la sessione
                    yield api.post(`/racesessions`, {
                        id: uuidv4(),
                        round: recordCount,
                        race_id: raceId,
                        date: sessions_pulselive[recordCount].date,
                        name: sessione_pulselive_name,
                        include_statistic: sessions_pulselive[recordCount].type === 'RACE' || sessions_pulselive[recordCount].type === 'SPR' ? true : false
                    });
                }
            }
        }
    });
}
//funzione che dato un codice iso3 prende l'id del country
function getCountryId(iso3) {
    return __awaiter(this, void 0, void 0, function* () {
        const country = yield api.get(`/countries?iso3=${iso3}`);
        return country.data ? country.data[0].id : null;
    });
}
export function processPulseliveSession(item) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const categoryPulseliveId = '3bda82ba-0445-440c-9375-cd48d777bd95'; // item.championship
            // Chiamata per ottenere le stagioni
            const seasonsResponse = yield fetch("https://api.motogp.pulselive.com/motogp/v1/results/seasons");
            const seasons = (yield seasonsResponse.json());
            console.log("Stagioni ottenute:", seasons.length);
            // Prendi l'ID della stagione più recente
            const currentSeason = seasons.find(season => season.current) || seasons[0];
            const currentSeasonId = currentSeason.id;
            console.log('ID della stagione corrente:', currentSeasonId);
            const eventsResponse = yield fetch(`https://api.motogp.pulselive.com/motogp/v1/results/events/?seasonUuid=${currentSeasonId}`);
            const allEvents = yield eventsResponse.json();
            const eventiNonTest = allEvents.filter(event => !event.test);
            //crea un for che cicli ogni evento e stampi il nome con un console.log
            let recordCount = 0;
            for (const event of eventiNonTest) {
                console.log(event.name);
                recordCount++;
                const raceId = yield upsertRace(event, recordCount, item.championship_id);
                //inserisco le sessioni
                if (raceId) {
                    yield insertSession(event, raceId, item.championship_id);
                }
            }
            /*  const response = await fetch(item.endpoint);
             const data = await response.json();
         
             // Elabora i dati e salvali nel database
             // ...
         
             console.log(`Elaborati i risultati per ${item.championship}`);
         
             // Crea un log di successo
         
             await api.post("/queue-log", {
               queue_id: item.id,
               log_type: "UPDATED",
               error_message: null,
               error_stack: null,
             }); */
            /*    .schema('dashboard')
              .from('queue_log')
              .insert({
                queue_id: item.id,
                log_type: 'SUCCESS',
                error_message: null,
                error_stack: null
              }); */
        }
        catch (error) {
            console.error(`Errore nell'elaborazione dei risultati per ${item.championship}:`, error);
            // Crea un log di errore
            yield supabase
                .schema("dashboard")
                .from("queue_log")
                .insert({
                queue_id: item.id,
                log_type: "ERROR",
                error_message: error instanceof Error ? error.message : "Errore sconosciuto",
                error_stack: error instanceof Error ? error.stack : null,
            });
            throw error; // Rilancia l'errore per gestirlo nel chiamante
        }
    });
}
//# sourceMappingURL=pulseliveSession.js.map