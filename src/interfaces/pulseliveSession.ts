import fetch from "node-fetch";
import { Tables } from "./../lib/database.types";
import { supabase } from "./../config/config.js";
import api from "./../config/axiosConfig.js";
import {
  PulseLive_Season,
  PulseLive_Event,
  PulseLive_Session,
  PulseLive_ClassificationEntry,
} from "./../lib/pulselive.interface";
import { v4 as uuidv4 } from 'uuid';

type ProcessQueue = Tables<{ schema: "dashboard" }, "process_queue">;
type Race = Tables<'races'>;

async function upsertRace(PulseLive_Event: PulseLive_Event, round: number, championshipId: string | null): Promise<string | null> {
  let raceId = null

  if (!championshipId) {
    return null;
  }

  let circuitId: string | null = null;

  const race = await api.get(`/races?championship_id=${championshipId}&round=${round}`);

  if (race.data.length > 0) {
    return race.data[0].id;
  } else {
    //da trovare prima il circuito
    const circuit = await api.get(`/circuits?id=${PulseLive_Event.circuit.id}`);
    if (circuit.data) {
      circuitId = circuit.data.id;
    } else {
      circuitId = PulseLive_Event.circuit.id;
      await api.post(`/circuits`, {
        id: circuitId,
        name: PulseLive_Event.circuit.name,
      });
    }

    //creo la gara 
    raceId = uuidv4();
    await api.post(`/races`, {
      id: raceId,
      championship_id: championshipId,
      circuit_id: circuitId,
      round: round,
      name: PulseLive_Event.circuit.name,
      location: PulseLive_Event.circuit.place,
      country_id: await getCountryId(PulseLive_Event.circuit.nation),
    });
  }

  return raceId;
}

async function upsertSession(PulseLive_Event: PulseLive_Event, raceId: string | null, championshipId: string | null) {

  //https://api.motogp.pulselive.com/motogp/v1/results/sessions?eventUuid=1cc0f19e-b77d-4bf5-8ca1-221b49a83593&categoryUuid=e8c110ad-64aa-4e8e-8a86-f2f152f6a942
  const sessions_pulselive = (await api.get(`/sessions?eventUuid=${PulseLive_Event.id}&categoryUuid=${championshipId}`)).data;
  const sessions = (await api.get(`/racesessions?race_id=${raceId}`)).data;

  let recordCount = 0;
  if (sessions_pulselive.data.length > 0) {
    for (const session of sessions.data) {
      recordCount++;
      if (sessions_pulselive[recordCount]) {
        console.log(session);
      }
    }
  }

}

//funzione che dato un codice iso3 prende l'id del country
async function getCountryId(iso3: string) {
  const country = await api.get(`/countries?iso3=${iso3}`);
  return country.data.id;
}

export async function processPulseliveSession(item: ProcessQueue) {
  try {

    const categoryPulseliveId = '3bda82ba-0445-440c-9375-cd48d777bd95'; // item.championship


    // Chiamata per ottenere le stagioni
    const seasonsResponse = await fetch("https://api.motogp.pulselive.com/motogp/v1/results/seasons");
    const seasons = (await seasonsResponse.json()) as PulseLive_Season[];
    console.log("Stagioni ottenute:", seasons.length);

    // Prendi l'ID della stagione più recente
    const currentSeason = seasons.find(season => season.current) || seasons[0];
    const currentSeasonId = currentSeason.id;
    console.log('ID della stagione corrente:', currentSeasonId);


    const eventsResponse = await fetch(`https://api.motogp.pulselive.com/motogp/v1/results/events/?seasonUuid=${currentSeasonId}`);
    const allEvents = await eventsResponse.json() as PulseLive_Event[];
    const eventiNonTest = allEvents.filter(event => !event.test);

    //crea un for che cicli ogni evento e stampi il nome con un console.log
    let recordCount = 0;
    for (const event of eventiNonTest) {
      console.log(event.name);
      recordCount++;
      const raceId = await upsertRace(event, recordCount, item.championship_id);

      //inserisco le sessioni
      if (raceId) {
        await upsertSession(event, raceId, item.championship_id);
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
  } catch (error) {
    console.error(
      `Errore nell'elaborazione dei risultati per ${item.championship}:`,
      error
    );

    // Crea un log di errore
    await supabase
      .schema("dashboard")
      .from("queue_log")
      .insert({
        queue_id: item.id,
        log_type: "ERROR",
        error_message:
          error instanceof Error ? error.message : "Errore sconosciuto",
        error_stack: error instanceof Error ? error.stack : null,
      });

    throw error; // Rilancia l'errore per gestirlo nel chiamante
  }
}


