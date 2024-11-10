import fetch from 'node-fetch';
import api from './../config/axiosConfig.js';
import { Tables } from './../lib/database.types';
import { PulseLive_Season, PulseLive_Event, PulseLive_Session, PulseLive_ClassificationEntry } from './../lib/pulselive.interface';
import { fetchAndInsertResults } from './../codeunit/SyncResultsDriversManagement.js';
import { json } from 'stream/consumers';
type ProcessQueue = Tables<{ schema: 'dashboard' }, 'process_queue'>;

export async function processPulseliveResult(item: ProcessQueue) {
  console.log('Inizio elaborazione dei risultati Pulselive:', new Date().toISOString());

  try {
    // Chiamata per ottenere le stagioni
    const seasonsResponse = await fetch('https://api.motogp.pulselive.com/motogp/v1/results/seasons');
    const seasons = await seasonsResponse.json() as PulseLive_Season[];
    console.log('Stagioni ottenute:', seasons.length);

    // Prendi l'ID della stagione più recente
    const currentSeason = seasons.find(season => season.current) || seasons[0];
    const currentSeasonId = currentSeason.id;
    console.log('ID della stagione corrente:', currentSeasonId);

    // Chiamata per ottenere gli eventi della stagione corrente
    const oggi = new Date('2024-11-04'); // const oggi = new Date(); // Usa questa riga per tornare alla data attuale
    const treGiorniFa = new Date(oggi.getTime() - 3 * 24 * 60 * 60 * 1000);

    const eventsResponse = await fetch(`https://api.motogp.pulselive.com/motogp/v1/results/events/?seasonUuid=${currentSeasonId}`);
    const allEvents = await eventsResponse.json() as PulseLive_Event[];

    //trovo il numero di round dell'ultima gara e escludo i test
    const eventiNonTest = allEvents.filter(event => !event.test);
    const eventiFiltrati = eventiNonTest.filter(event => {
      const dataEvento = new Date(event.date_start);
      return dataEvento >= treGiorniFa && dataEvento <= oggi;
    });

    //Prendo l'ultima gara
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
    } else {
      console.log('Nessun evento trovato nell\'intervallo');
    }
    //console.log('tre giorni fa:', treGiorniFa);
    const latestEventId = ultimoEvento.id;


    // Chiamata per ottenere le sessioni dell'ultimo evento
    const sessionsResponse = await fetch(`https://api.motogp.pulselive.com/motogp/v1/results/sessions?eventUuid=${latestEventId}&categoryUuid=e8c110ad-64aa-4e8e-8a86-f2f152f6a942`);
    const sessions = await sessionsResponse.json() as PulseLive_Session[];
    //console.log('Sessioni ottenute per l\'ultimo evento:', sessions.length);


    // Leggi tutte le sessioni e lancia la funzione InsertSessionResults
    const oraAttuale = new Date();
    for (const session of sessions) {
      //const dataSessione = new Date(session.date);
      //if (dataSessione.getTime() + 3600000 < oraAttuale.getTime()) {
        console.log('SESSION --------------------------------------------------------------');
        console.log('Elaborazione risultati sessione:', session.type, 'id:', session.id, 'con numero round:', numeroRound);

        await fetchAndInsertResults(session, item.championship_id, numeroRound);
      //}
    }











    /*
        
    
        
    
        // Prendi l'ultimo evento
        
    
        
    
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
    
        // Utilizza api per inviare il log
        await api.post('/queue-log', {
          queue_id: item.id,
          log_type: 'UPDATED',
          error_message: alertMessage,
          error_stack: null,
        });
    
        // Ottieni i risultati dell'ultima sessione
        if (ultimaSessioneId) {
          const risultatiResponse = await fetch(`https://api.motogp.pulselive.com/motogp/v1/results/session/${ultimaSessioneId}/classification`);
          const risultatiData = await risultatiResponse.json() as any;
          const risultati: PulseLive_ClassificationEntry[] = risultatiData.classification || [];
    
          console.log('Risultati ottenuti per l\'ultima sessione:', risultati.length);
    
          // Crea messaggi per i primi 3 piloti
          const messaggiPiloti = risultati.slice(0, 3).map((risultato: PulseLive_ClassificationEntry) => {
            console.log(`Posizione ${risultato.position}: ${risultato.rider.full_name}`);
            return `Posizione ${risultato.position}: ${risultato.rider.full_name}`;
          });
    
          // Crea un unico messaggio con i risultati
          const messaggioRisultati = `Risultati top 3:\n${messaggiPiloti.join('\n')}`;
          console.log(messaggioRisultati);
    
          // Utilizza api per inviare il log dei risultati
          await api.post('/queue-log', {
            queue_id: item.id,
            log_type: 'UPDATED',
            error_message: messaggioRisultati,
            error_stack: null,
          });
          console.log('Log dei risultati inserito');
        } else {
          console.log('Nessuna sessione valida trovata per ottenere i risultati');
        }
    
        // Aggiorna lo stato del processo nella coda utilizzando la nuova API
        await api.put(`/process-queue/${item.id}`, { status: 'completed' });
        console.log('Stato del processo aggiornato a "completed"');
    
        // Inserisci il log di successo
        await api.post('/queue-log', {
          queue_id: item.id,
          log_type: 'UPDATED',
          error_message: alertMessages.join('\n'),
          error_stack: null,
        });
        console.log('Log di successo inserito');
    */
  } catch (error) {
    console.error('Errore durante l\'elaborazione dei risultati Pulselive:', error);

    // Aggiorna lo stato del processo nella coda in caso di errore
    await api.put(`/process-queue/${item.id}`, { status: 'error', error_message: (error as Error).message });
    console.log('Stato del processo aggiornato a "error"');

    // Utilizza api per inviare il log di errore
    await api.post('/queue-log', {
      queue_id: item.id,
      log_type: 'ERROR',
      error_message: error instanceof Error ? error.message : 'Errore sconosciuto',
      error_stack: error instanceof Error ? error.stack : null,
    });
    console.log('Log di errore inserito');
  }

  async function InsertSessionResults(session: PulseLive_Session, currentSeasonId: string | null, numeroRound: number) {
    console.log('SESSION --------------------------------------------------------------');
    console.log('Elaborazione dei risultati per la sessione:', session.type, 'id:', session.id, 'con numero round:', numeroRound);

    // Logica per inserire i risultati della sessione
    await fetchAndInsertResults(session, currentSeasonId, numeroRound);


    // Crea messaggi per i primi 3 piloti
    /* const messaggiPiloti = risultati.slice(0, 3).map((risultato: PulseLive_ClassificationEntry) => {
      console.log(`Posizione ${risultato.position}: ${risultato.rider.full_name}`);
      return `Posizione ${risultato.position}: ${risultato.rider.full_name}`;
    }); */

    // Crea un unico messaggio con i risultati
    /* const messaggioRisultati = `Risultati top 3:\n${messaggiPiloti.join('\n')}`;
    console.log(messaggioRisultati); */

    // Utilizza api per inviare il log dei risultati
    /* await api.post('/queue-log', {
      queue_id: session.id, // Assicurati di avere un ID valido per la coda
      log_type: 'UPDATED',
      error_message: messaggioRisultati,
      error_stack: null,
    }); */
    //console.log('Log dei risultati inserito');
  }
}