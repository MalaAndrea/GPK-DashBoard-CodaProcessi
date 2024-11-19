var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fetch from 'node-fetch';
import api from './../config/axiosConfig.js';
import { fetchAndInsertResults } from './../codeunit/SyncResultsDriversManagement.js';
export function processPulseliveResult(item) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Inizio elaborazione dei risultati Pulselive:', new Date().toISOString());
        const totalResults = true;
        try {
            // Chiamata per ottenere le stagioni
            const seasonsResponse = yield fetch('https://api.motogp.pulselive.com/motogp/v1/results/seasons');
            const seasons = yield seasonsResponse.json();
            console.log('Stagioni ottenute:', seasons.length);
            // Prendi l'ID della stagione più recente
            const currentSeason = seasons.find(season => season.current) || seasons[0];
            const currentSeasonId = 'dd12382e-1d9f-46ee-a5f7-c5104db28e43'; //const currentSeasonId = currentSeason.id;
            console.log('ID della stagione corrente:', currentSeasonId);
            // Chiamata per ottenere gli eventi della stagione corrente
            const oggi = new Date('2024-11-04'); // const oggi = new Date(); // Usa questa riga per tornare alla data attuale
            const treGiorniFa = new Date(oggi.getTime() - 3 * 24 * 60 * 60 * 1000);
            const eventsResponse = yield fetch(`https://api.motogp.pulselive.com/motogp/v1/results/events/?seasonUuid=${currentSeasonId}`);
            const allEvents = yield eventsResponse.json();
            //trovo il numero di round dell'ultima gara e escludo i test
            const eventiNonTest = allEvents.filter(event => !event.test);
            const eventiFiltrati = totalResults ? eventiNonTest : eventiNonTest.filter(event => {
                const dataEvento = new Date(event.date_start);
                return dataEvento >= treGiorniFa && dataEvento <= oggi;
            });
            let latestEventId = null;
            //Prendo l'ultima gara
            if (!totalResults) {
                let numeroRound = 0;
                const ultimoEvento = eventiFiltrati[eventiFiltrati.length - 1];
                if (ultimoEvento) {
                    console.log('Ultimo evento nell\'intervallo:', ultimoEvento.name, ' Questo è il round numero:', numeroRound, 'con id:', ultimoEvento.id);
                    numeroRound = eventiNonTest
                        .filter(event => {
                        const dataEvento = new Date(event.date_start);
                        return dataEvento <= new Date(ultimoEvento.date_start);
                    })
                        .length;
                }
                else {
                    console.log('Nessun evento trovato nell\'intervallo');
                }
                //console.log('tre giorni fa:', treGiorniFa);
                latestEventId = ultimoEvento.id;
                // Chiamata per ottenere le sessioni dell'ultimo evento
                const sessionsResponse = yield fetch(`https://api.motogp.pulselive.com/motogp/v1/results/sessions?eventUuid=${latestEventId}&categoryUuid=${item.championship}`);
                const sessions = yield sessionsResponse.json();
                //console.log('Sessioni ottenute per l\'ultimo evento:', sessions.length);
                // Leggi tutte le sessioni e lancia la funzione InsertSessionResults
                const oraAttuale = new Date();
                let count = 0;
                for (const session of sessions) {
                    //const dataSessione = new Date(session.date);
                    //if (dataSessione.getTime() + 3600000 < oraAttuale.getTime()) {
                    console.log('SESSION --------------------------------------------------------------');
                    console.log('Elaborazione risultati sessione:', session.type, 'id:', session.id, 'con numero round:', numeroRound);
                    try {
                        yield fetchAndInsertResults(session, count, item.championship_id, numeroRound);
                    }
                    catch (error) {
                        console.error(error);
                    }
                    count++;
                    //}
                }
            }
            else {
                console.log('Elaborazione risultati totali');
                let numeroRound = 0;
                for (const event of eventiFiltrati) {
                    numeroRound++;
                    latestEventId = event.id;
                    console.log('------------------------------------------------------------------------------------------------');
                    console.log('------------------------------------------------------------------------------------------------');
                    console.log('------------------------------------------------------------------------------------------------');
                    console.log('Elaborazione risultati evento:', event.name, 'con id:', event.id, 'con numero round:', numeroRound);
                    // Chiamata per ottenere le sessioni dell'ultimo evento
                    const sessionsResponse = yield fetch(`https://api.motogp.pulselive.com/motogp/v1/results/sessions?eventUuid=${latestEventId}&categoryUuid=${item.championship}`);
                    const sessions = yield sessionsResponse.json();
                    // Leggi tutte le sessioni e lancia la funzione InsertSessionResults
                    let count = 0;
                    for (const session of sessions) {
                        console.log('SESSION --------------------------------------------------------------');
                        console.log('Elaborazione risultati sessione:', session.type, 'id:', session.id, 'con numero round:', numeroRound);
                        try {
                            fetchAndInsertResults(session, count, item.championship_id, numeroRound);
                        }
                        catch (error) {
                            console.error(error);
                        }
                        count++;
                    }
                }
            }
        }
        catch (error) {
            console.error('Errore durante l\'elaborazione dei risultati Pulselive:', error);
            // Aggiorna lo stato del processo nella coda in caso di errore
            yield api.put(`/process-queue/${item.id}`, { status: 'error', error_message: error.message });
            console.log('Stato del processo aggiornato a "error"');
            // Utilizza api per inviare il log di errore
            yield api.post('/queue-log', {
                queue_id: item.id,
                log_type: 'ERROR',
                error_message: error instanceof Error ? error.message : 'Errore sconosciuto',
                error_stack: error instanceof Error ? error.stack : null,
            });
            console.log('Log di errore inserito');
        }
    });
}
//# sourceMappingURL=pulseliveResult.js.map