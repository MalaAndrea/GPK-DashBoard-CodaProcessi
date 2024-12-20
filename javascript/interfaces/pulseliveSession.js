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
import { inspect } from 'util';
function upsertRace(PulseLive_Event, round, championshipId) {
    return __awaiter(this, void 0, void 0, function* () {
        let raceId = null;
        let circuitId = null;
        if (!championshipId) {
            return null;
        }
        const race = yield api.get(`/races?championship_id=${championshipId}&round=${round}`);
        console.log('race:', race.data.length);
        if (race.data.length > 0) {
            return race.data[0].id;
        }
        else {
            circuitId = yield upsertCircuit(PulseLive_Event);
            //creo la gara 
            console.log('circuitId:', circuitId);
            if (circuitId) {
                raceId = uuidv4();
                yield api.post(`/races/newRace`, {
                    id: raceId,
                    championship_id: championshipId,
                    circuit_id: circuitId,
                    season_id: 2024,
                    round: round,
                    name: PulseLive_Event.name,
                });
                console.log('raceId:', raceId);
            }
        }
        return raceId;
    });
}
function upsertCircuit(PulseLive_Event) {
    return __awaiter(this, void 0, void 0, function* () {
        //var
        let circuit = null;
        let circuitExists = null;
        let circuitId = null;
        //da trovare  il circuito
        console.log('PulseLive_Event.circuit.id:', PulseLive_Event.circuit.id);
        circuitId = PulseLive_Event.circuit.id;
        try {
            circuitExists = (yield api.get(`/circuits/exists?id=${circuitId}`)).data;
        }
        catch (error) {
            console.error('Errore nella chiamata all\'API:', error.message || error);
        }
        console.log('circuitExists:', circuitExists);
        try {
            const countryId = yield getCountryId(PulseLive_Event.circuit.nation);
            if (!circuitExists.exists) {
                yield api.post(`/circuits`, {
                    id: circuitId,
                    name: PulseLive_Event.circuit.name,
                    location: PulseLive_Event.circuit.place,
                    country_id: countryId,
                    lat: 0,
                    long: 0
                });
                console.log('circuito inserito:', circuitId);
            }
        }
        catch (error) {
            console.error(error);
            circuitId = null;
        }
        return circuitId;
    });
}
function insertSession(PulseLive_Event, raceId, championshipId) {
    return __awaiter(this, void 0, void 0, function* () {
        const sessionResponse = yield fetch(`https://api.motogp.pulselive.com/motogp/v1/results/sessions?eventUuid=${PulseLive_Event.id}&categoryUuid=${championshipId}`);
        const sessions_pulselive = (yield sessionResponse.json());
        //const sessions_pulselive = (await api.get(`/sessions?eventUuid=${PulseLive_Event.id}&categoryUuid=${championshipId}`)).data;
        const sessions = (yield api.get(`/racesessions?race_id=${raceId}`)).data;
        console.log('sessions_pulselive:', sessions_pulselive.length);
        let recordCount = 0;
        if (sessions_pulselive.length > 0) {
            for (const session of sessions_pulselive) {
                if (recordCount >= sessions_pulselive.length)
                    break;
                const sessione_pulselive_name = sessions_pulselive[recordCount].number === 0 || sessions_pulselive[recordCount].number === null ? sessions_pulselive[recordCount].type : sessions_pulselive[recordCount].type + sessions_pulselive[recordCount].number;
                if (sessions[recordCount]) {
                    if (sessions_pulselive[recordCount].date !== sessions[recordCount].date) {
                        /* await api.put(`/racesessions/${sessions[recordCount].id}`, {
                          date: sessions_pulselive[recordCount].date,
                        }); */
                    }
                    if (sessione_pulselive_name !== sessions[recordCount].name) {
                        /* await api.put(`/racesessions/${sessions[recordCount].id}`, {
                          name: sessione_pulselive_name,
                        }); */
                    }
                }
                else {
                    //inserisco la sessione
                    const sessionData = {
                        id: uuidv4(),
                        round: recordCount + 1,
                        race_id: raceId,
                        date: sessions_pulselive[recordCount].date,
                        name: sessione_pulselive_name,
                        include_statistic: sessions_pulselive[recordCount].type === 'RAC' || sessions_pulselive[recordCount].type === 'SPR' ? true : false
                    };
                    try {
                        yield api.post(`/racesessions`, {
                            id: uuidv4(),
                            round: recordCount + 1,
                            race_id: raceId,
                            date: sessions_pulselive[recordCount].date,
                            name: sessione_pulselive_name,
                            include_statistic: sessions_pulselive[recordCount].type === 'RAC' || sessions_pulselive[recordCount].type === 'SPR' ? true : false
                        });
                    }
                    catch (error) {
                        console.error(error);
                    }
                    console.log('Sessione inserita:', sessionData);
                }
                recordCount++;
            }
        }
    });
}
//funzione che dato un codice iso3 prende l'id del country
function getCountryId(iso3) {
    return __awaiter(this, void 0, void 0, function* () {
        const country = (yield api.get(`/countries?iso3=${iso3}`)).data;
        if (!country || country.length === 0) {
            console.log('country non trovato: ' + iso3);
            yield new Promise(resolve => setTimeout(resolve, 40000));
            return null;
        }
        return country[0] ? country[0].id : null;
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
            console.log('eventiNonTest:', eventiNonTest.length);
            //crea un for che cicli ogni evento e stampi il nome con un console.log
            let recordCount = 0;
            for (const event of eventiNonTest) {
                console.log(event.name);
                if (yield checkSession(event, item.championship)) {
                    recordCount++;
                    const raceId = yield upsertRace(event, recordCount, item.championship_id);
                    //inserisco le sessioni
                    if (raceId) {
                        try {
                            yield insertSession(event, raceId, item.championship);
                        }
                        catch (error) {
                            console.error('Errore durante l\'inserimento della sessione:', error instanceof Error ? error.message : error);
                        }
                    }
                }
            }
            console.log('processPulseliveSession completato');
            console.log('inseriti ' + recordCount + ' eventi');
            console.log('--------------------------------');
            console.log('--------------------------------');
            console.log('--------------------------------');
            try {
                yield supabase
                    .schema("dashboard")
                    .from("queue_log")
                    .insert({
                    queue_id: item.id,
                    log_type: "UPDATED",
                });
            }
            catch (error) {
                console.error(error);
            }
        }
        catch (error) {
            console.error(`Errore nell'elaborazione dei risultati per ${item.championship}:`, error instanceof Error ? error.message : error);
            // Crea un log di errore
            yield supabase
                .schema("dashboard")
                .from("queue_log")
                .insert({
                queue_id: item.id,
                log_type: "ERROR",
                error_message: error instanceof Error ? error.message : "Errore sconosciuto",
                error_stack: error instanceof Error ? inspect(error) : null,
            });
            throw error; // Rilancia l'errore per gestirlo nel chiamante
        }
    });
}
//Funzione che controlla se esistono sessioni per quella gara e campionato
function checkSession(PulseLive_Event, championshipId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!championshipId) {
            return false;
        }
        const sessionResponse = yield fetch(`https://api.motogp.pulselive.com/motogp/v1/results/sessions?eventUuid=${PulseLive_Event.id}&categoryUuid=${championshipId}`);
        const sessions_pulselive = (yield sessionResponse.json());
        return sessions_pulselive.length > 0;
    });
}
//# sourceMappingURL=pulseliveSession.js.map