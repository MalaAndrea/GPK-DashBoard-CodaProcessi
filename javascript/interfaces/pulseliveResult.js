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
import { supabase } from './../config/config.js';
export function processPulseliveResult(item) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Inizio elaborazione dei risultati Pulselive:', new Date().toISOString());
        try {
            // Chiamata per ottenere le stagioni
            const seasonsResponse = yield fetch('https://api.motogp.pulselive.com/motogp/v1/results/seasons');
            const seasons = yield seasonsResponse.json();
            console.log('Stagioni ottenute:', seasons.length);
            // Prendi l'ID della stagione più recente
            const currentSeason = seasons.find(season => season.current) || seasons[0];
            const currentSeasonId = currentSeason.id;
            console.log('ID della stagione corrente:', currentSeasonId);
            // Chiamata per ottenere gli eventi della stagione corrente
            const oggi = new Date();
            const dieciGiorniFa = new Date(oggi.getTime() - 40 * 24 * 60 * 60 * 1000);
            const eventsResponse = yield fetch(`https://api.motogp.pulselive.com/motogp/v1/results/events/?seasonUuid=${currentSeasonId}`);
            const allEvents = yield eventsResponse.json();
            const eventiFiltrati = allEvents.filter(event => {
                const dataEvento = new Date(event.date_start);
                return dataEvento >= dieciGiorniFa && dataEvento <= oggi;
            });
            const ultimoEvento = eventiFiltrati[eventiFiltrati.length - 1];
            console.log('Ultimo evento nell\'intervallo:', ultimoEvento ? ultimoEvento.name : 'Nessun evento trovato');
            console.log('Numero di eventi nell\'intervallo:', eventiFiltrati.length);
            console.log('dieci giorni fa:', dieciGiorniFa);
            // Prendi l'ultimo evento
            const latestEventId = ultimoEvento.id; //7533f0a8-d411-4d9b-b07d-28f77022333f - c4f2864e-f054-4843-baef-ba32d91b615a
            console.log('ID dell\'ultimo evento:', latestEventId);
            // Chiamata per ottenere le sessioni dell'ultimo evento
            const sessionsResponse = yield fetch(`https://api.motogp.pulselive.com/motogp/v1/results/sessions?eventUuid=${latestEventId}&categoryUuid=e8c110ad-64aa-4e8e-8a86-f2f152f6a942`);
            const sessions = yield sessionsResponse.json();
            console.log('Sessioni ottenute per l\'ultimo evento:', sessions.length);
            // Filtra le sessioni finite e stampa gli alert
            const oraAttuale = new Date();
            const sessioniFiltrate = sessions.filter(session => {
                const dataSessione = new Date(session.date);
                return dataSessione.getTime() + 3600000 < oraAttuale.getTime();
            });
            const ultimaSessione = sessioniFiltrate[sessioniFiltrate.length - 1];
            const ultimaSessioneId = ultimaSessione ? ultimaSessione.id : null;
            console.log('ID dell\'ultima sessione filtrata:', ultimaSessioneId);
            const alertMessages = [];
            const alertMessage = `Gran Premio: ${ultimaSessione.event.name}, ID Sessione: ${ultimaSessione.id}`;
            console.log(alertMessage);
            alertMessages.push(alertMessage);
            yield supabase
                .schema('dashboard')
                .from('queue_log')
                .insert({
                queue_id: item.id,
                log_type: 'UPDATED',
                error_message: alertMessage,
                error_stack: null
            });
            // Ottieni i risultati dell'ultima sessione
            if (ultimaSessioneId) {
                const risultatiResponse = yield fetch(`https://api.motogp.pulselive.com/motogp/v1/results/session/${ultimaSessioneId}/classification`);
                const risultatiData = yield risultatiResponse.json();
                const risultati = risultatiData.classification || [];
                console.log('Risultati ottenuti per l\'ultima sessione:', risultati.length);
                // Crea messaggi per i primi 3 piloti
                const messaggiPiloti = risultati.slice(0, 3).map((risultato) => {
                    console.log(`Posizione ${risultato.position}: ${risultato.rider.full_name}`);
                    return `Posizione ${risultato.position}: ${risultato.rider.full_name}`;
                });
                // Crea un unico messaggio con i risultati
                const messaggioRisultati = `Risultati top 3:\n${messaggiPiloti.join('\n')}`;
                console.log(messaggioRisultati);
                // Inserisci il log con i risultati
                yield supabase
                    .schema('dashboard')
                    .from('queue_log')
                    .insert({
                    queue_id: item.id,
                    log_type: 'UPDATED',
                    error_message: messaggioRisultati,
                    error_stack: null
                });
                console.log('Log dei risultati inserito');
            }
            else {
                console.log('Nessuna sessione valida trovata per ottenere i risultati');
            }
            yield supabase
                .from('process_queue')
                .update({ status: 'completed' })
                .eq('id', item.id);
            console.log('Stato del processo aggiornato a "completed"');
            // Inserisci il log di successo
            yield supabase
                .schema('dashboard')
                .from('queue_log')
                .insert({
                queue_id: item.id,
                log_type: 'UPDATED',
                error_message: alertMessages.join('\n'),
                error_stack: null
            });
            console.log('Log di successo inserito');
            //TODO: Recupero l'id del mio db e lo inserisco nella tabella inseriti
        }
        catch (error) {
            console.error('Errore durante l\'elaborazione dei risultati Pulselive:', error);
            // Aggiorna lo stato del processo nella coda in caso di errore
            yield supabase
                .from('process_queue')
                .update({ status: 'error', error_message: error.message })
                .eq('id', item.id);
            console.log('Stato del processo aggiornato a "error"');
            // Inserisci il log di errore
            yield supabase
                .schema('dashboard')
                .from('queue_log')
                .insert({
                queue_id: item.id,
                log_type: 'ERROR',
                error_message: error instanceof Error ? error.message : 'Errore sconosciuto',
                error_stack: error instanceof Error ? error.stack : null
            });
            console.log('Log di errore inserito');
        }
    });
}
