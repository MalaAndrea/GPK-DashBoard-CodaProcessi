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
import { inspect } from 'util';
import { exit } from "process";

type ProcessQueue = Tables<{ schema: "dashboard" }, "process_queue">;
type Race = Tables<'races'>;
type RaceSession = Tables<'race_sessions'>;

async function upsertRace(PulseLive_Event: PulseLive_Event, round: number, championshipId: string | null): Promise<string | null> {
  let raceId = null
  let circuitId: string | null = null;

  if (!championshipId) {
    return null;
  }

  const race = await api.get(`/races?championship_id=${championshipId}&round=${round}`);

  console.log('race:', race.data.length);
  if (race.data.length > 0) {
    return race.data[0].id;
  } else {

    circuitId = await upsertCircuit(PulseLive_Event);

    //creo la gara 
    console.log('circuitId:', circuitId);
    if (circuitId) {
      raceId = uuidv4();
      await api.post(`/races/newRace`, {
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
}

async function upsertCircuit(PulseLive_Event: PulseLive_Event): Promise<string | null> {
  //var
  let circuit = null;
  let circuitExists: any = null;
  let circuitId: string | null = null;

  //da trovare  il circuito
  console.log('PulseLive_Event.circuit.id:', PulseLive_Event.circuit.id);
  circuitId = PulseLive_Event.circuit.id;
  try {
    circuitExists = (await api.get(`/circuits/exists?id=${circuitId}`)).data;
  } catch (error: any) { console.error('Errore nella chiamata all\'API:', error.message || error); }


  console.log('circuitExists:', circuitExists);
  try {
    const countryId = await getCountryId(PulseLive_Event.circuit.nation);
    if (!circuitExists.exists) {
      await api.post(`/circuits`, {
        id: circuitId,
        name: PulseLive_Event.circuit.name,
        location: PulseLive_Event.circuit.place,
        country_id: countryId,
        lat: 0,
        long: 0
      });
      console.log('circuito inserito:', circuitId);
    }
  } catch (error) { console.error(error); circuitId = null; }

  return circuitId;
}

async function insertSession(PulseLive_Event: PulseLive_Event, raceId: string | null, championshipId: string | null) {

  const sessionResponse = await fetch(`https://api.motogp.pulselive.com/motogp/v1/results/sessions?eventUuid=${PulseLive_Event.id}&categoryUuid=${championshipId}`);
  const sessions_pulselive = (await sessionResponse.json()) as PulseLive_Session[];
  //const sessions_pulselive = (await api.get(`/sessions?eventUuid=${PulseLive_Event.id}&categoryUuid=${championshipId}`)).data;
  const sessions: RaceSession[] = (await api.get(`/racesessions?race_id=${raceId}`)).data;

  console.log('sessions_pulselive:', sessions_pulselive.length);

  let recordCount = 0;
  if (sessions_pulselive.length > 0) {
    for (const session of sessions_pulselive) {
      if (recordCount >= sessions_pulselive.length) break;

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
      } else {
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
          await api.post(`/racesessions`, {
            id: uuidv4(),
            round: recordCount + 1,
            race_id: raceId,
            date: sessions_pulselive[recordCount].date,
            name: sessione_pulselive_name,
            include_statistic: sessions_pulselive[recordCount].type === 'RAC' || sessions_pulselive[recordCount].type === 'SPR' ? true : false
          });
        } catch (error) { console.error(error); }
        console.log('Sessione inserita:', sessionData);
      }

      recordCount++;
    }
  }
}

//funzione che dato un codice iso3 prende l'id del country
async function getCountryId(iso3: string) {
  const country = (await api.get(`/countries?iso3=${iso3}`)).data;
  if (!country || country.length === 0) {
    console.log('country non trovato: ' + iso3);
    await new Promise(resolve => setTimeout(resolve, 40000));
    return null;
  }
  return country[0] ? country[0].id : null;
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
    console.log('eventiNonTest:', eventiNonTest.length);

    //crea un for che cicli ogni evento e stampi il nome con un console.log
    let recordCount = 0;
    for (const event of eventiNonTest) {
      console.log(event.name);
      if (await checkSession(event, item.championship)) {
        recordCount++;
        const raceId = await upsertRace(event, recordCount, item.championship_id);

        //inserisco le sessioni
        if (raceId) {
          try {
            await insertSession(event, raceId, item.championship);
          } catch (error: any) { console.error('Errore durante l\'inserimento della sessione:', error instanceof Error ? error.message : error); }
        }
      }
    }

    console.log('processPulseliveSession completato');
    console.log('inseriti ' + recordCount + ' eventi');
    console.log('--------------------------------');
    console.log('--------------------------------');
    console.log('--------------------------------');


    try {
      await supabase
        .schema("dashboard")
        .from("queue_log")
        .insert({
          queue_id: item.id,
          log_type: "UPDATED",
        });
    }
    catch (error) { console.error(error); }

  } catch (error: any) {
    console.error(
      `Errore nell'elaborazione dei risultati per ${item.championship}:`,
      error instanceof Error ? error.message : error
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
        error_stack: error instanceof Error ? inspect(error) : null,
      });

    throw error; // Rilancia l'errore per gestirlo nel chiamante
  }
}



//Funzione che controlla se esistono sessioni per quella gara e campionato
async function checkSession(PulseLive_Event: PulseLive_Event, championshipId: string | null): Promise<boolean> {
  if (!championshipId) {
    return false;
  }
  const sessionResponse = await fetch(`https://api.motogp.pulselive.com/motogp/v1/results/sessions?eventUuid=${PulseLive_Event.id}&categoryUuid=${championshipId}`);
  const sessions_pulselive = (await sessionResponse.json()) as PulseLive_Session[];

  return sessions_pulselive.length > 0;
}

