import { Tables } from '../lib/database.types.js';
import api from '../config/axiosConfig.js';
import { PulseLive_Session, PulseLive_ClassificationEntry } from './../lib/pulselive.interface';
import { v4 as uuidv4 } from 'uuid';
import { insertDriver } from './driverManagement.js';

type result = Tables<'results'>;
type result_driver = Tables<'result_drivers'>;
type race_sessions = Tables<'race_sessions'>;
type race_sessions_results = {
    race: Tables<'races'>;
    race_sessions: (Tables<'race_sessions'> & { resultsInserted: boolean })[];
};

export async function fetchAndInsertResults(session: PulseLive_Session, count: number, currentSeasonId: string | null, numeroRound: number) {

    if (!currentSeasonId) { return; }
    // Logica per inserire i risultati della sessione
    const risultatiResponse = await fetch(`https://api.motogp.pulselive.com/motogp/v1/results/session/${session.id}/classification`);
    const risultatiData = await risultatiResponse.json() as any;
    const risultati: PulseLive_ClassificationEntry[] = risultatiData.classification || [];

    const results_racesessionresults = await api.get(`/races/race-sessions-results?championship_id=${currentSeasonId}&round=${numeroRound}`);
    console.log('----------------------------------------------------------------------------------');
    console.log('Risultati ottenuti per le gare:', currentSeasonId, numeroRound);

    //await new Promise(resolve => setTimeout(resolve, 10000));
    let position = 0;
    for (const risultato of risultati) {
        position++;
        //console.log(`Rider Name : ${risultato.rider.number} ${currentSeasonId}`);
        let team_season_drivers_id = null;
        try {
            team_season_drivers_id = await insertDriver(risultato, currentSeasonId,);
        } catch (error) { console.error(error); }

        if (team_season_drivers_id) {
            if (results_racesessionresults.data && results_racesessionresults.data.length > 0 && results_racesessionresults.data[0].race_sessions) {
                await insertResultsDriver(team_season_drivers_id, risultato, session, results_racesessionresults.data[0].race_sessions[count], count, position);
            } else {
                console.error('Nessun risultato trovato per la sessione:', session.id);
            }
        }
    }
}

export async function insertResultsDriver(team_season_drivers_id: string, risultato: PulseLive_ClassificationEntry, session: PulseLive_Session, race_sessions_results: any, count: number, position: number) {

    if (!race_sessions_results) {
        console.error('race_sessions_results o race_sessions non sono definiti o non sono un array');
        return;
    }

    //prendo l'ultima sessione senza result ( prendo l'array race_sessions_results.race_sessions e filtro per resultsInserted false e prendo l'id della prima sessione)
    const sessionId = race_sessions_results.id;
    if (!sessionId) {
        return;
    }

    const resultId = uuidv4();
    const points = risultato.points ? risultato.points : 0;
    //devo creare prima results e poi result_drivers
    try {
        const result_get = (await api.get(`/results?race_session_id=${sessionId}&position=${position}`)).data;

        if (result_get.length > 0) {
            const result = await api.put(`/results/${result_get[0].id}`, {
                points: points,
                pole: false,
                retired: risultato.status === 'INSTND' ? false : true,
                synchronized: false
            });
        } else {
            const result = await api.post('/results', {
                id: resultId,
                created_at: new Date().toISOString(),
                deleted_at: null,
                last_modified_at: new Date().toISOString(),
                points: points,
                pole: false,
                position: position,
                race_session_id: sessionId,
                retired: risultato.status === 'INSTND' ? false : true,
                updated_at: new Date().toISOString(),
                synchronized: false
            });

            if (result.data) {
                const result_driver = await api.post('/result-drivers', {
                    id: uuidv4(),
                    result_id: resultId,
                    team_season_drivers_id: team_season_drivers_id,
                });
            }
        }


    } catch (error) {
        console.error(error);
    }

    console.log('inserito risultato - posizione:', position);

}


//creare una funzione che in base alla data di oggi usando questa variabile  const oggi = new Date('2024-11-04'); // const oggi = new Date(); // Usa questa riga per tornare alla data attuale deve prendere la data del giovedi e del lunedi e restituirle come un oggetto con due date
export function getThursdayAndMondayDates(oggi: Date): { thursday: Date, monday: Date } {
    const dayOfWeek = oggi.getDay();
    let thursday: Date;
    let monday: Date;

    if (dayOfWeek === 1) { // Se oggi è lunedì
        thursday = new Date(oggi);
        thursday.setDate(oggi.getDate() - 3); // Giovedì della settimana precedente
        thursday.setHours(0, 0, 0, 0);

        monday = new Date(oggi); // Restituisce il lunedì corrente
        monday.setHours(23, 59, 59, 999);
    } else { // Da martedì a domenica
        thursday = new Date(oggi);
        thursday.setDate(oggi.getDate() + (4 - dayOfWeek + 7) % 7); // Giovedì della settimana corrente
        thursday.setHours(0, 0, 0, 0);

        monday = new Date(thursday);
        monday.setDate(thursday.getDate() + 3); // Lunedì della prossima settimana
        monday.setHours(23, 59, 59, 999);
    }

    return { thursday, monday };
}
