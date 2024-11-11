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
type RaceSession = Tables<'race_sessions'>;

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
    let circuit = null;
    try {
      circuit = await api.get(`/circuits?id=${PulseLive_Event.circuit.id}`);
    } catch (error) {
      console.error(error);
    }
    if (circuit && circuit.data) {
      circuitId = circuit.data.id;
    } else {
      circuitId = PulseLive_Event.circuit.id;
      const countryId = await getCountryId(PulseLive_Event.circuit.nation);
      await api.post(`/circuits`, {
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
      await api.post(`/races/newRace`, {
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
}

async function insertSession(PulseLive_Event: PulseLive_Event, raceId: string | null, championshipId: string | null) {

  const sessions_pulselive = (await api.get(`/sessions?eventUuid=${PulseLive_Event.id}&categoryUuid=${championshipId}`)).data;
  const sessions: RaceSession[] = (await api.get(`/racesessions?race_id=${raceId}`)).data;

  let recordCount = 0;
  if (sessions_pulselive.data.length > 0) {
    for (const session of sessions) {
      recordCount++;
      const sessione_pulselive_name = sessions_pulselive[recordCount].number === 0 ? sessions_pulselive[recordCount].name : sessions_pulselive[recordCount].name + ' - ' + sessions_pulselive[recordCount].number;
      if (sessions[recordCount]) {
        if (sessions_pulselive[recordCount].date !== sessions[recordCount].date) {
          await api.put(`/racesessions/${sessions[recordCount].id}`, {
            date: sessions_pulselive[recordCount].date,
          });
        }
        if (sessione_pulselive_name !== sessions[recordCount].name) {
          await api.put(`/racesessions/${sessions[recordCount].id}`, {
            name: sessione_pulselive_name,
          });
        }
      } else {
        //inserisco la sessione
        await api.post(`/racesessions`, {
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

}

//funzione che dato un codice iso3 prende l'id del country
async function getCountryId(iso3: string) {
  const country = await api.get(`/countries?iso3=${iso3}`);
  return country.data ? country.data[0].id : null;
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
        await insertSession(event, raceId, item.championship_id);
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


