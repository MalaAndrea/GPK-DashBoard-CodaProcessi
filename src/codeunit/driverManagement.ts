import { Tables } from '../lib/database.types';
import api from './../config/axiosConfig.js';
import { PulseLive_ClassificationEntry } from './../lib/pulselive.interface';
import { v4 as uuidv4 } from 'uuid';

type driver = Tables<'drivers'>;
type team_season_drivers = Tables<'team_season_drivers'>;
type teams = Tables<'teams'>;

//codeunit che gestisce i drivers / team_season_drivers / teams

export async function insertDriver(risultato: PulseLive_ClassificationEntry, championshipId: string) : Promise<string> {

    const driver = await api.get(`/drivers/teamseasondriver-by-number?driverNumber=${risultato.rider.number}&championshipId=${championshipId}`);

    if (driver.data) {
        return driver.data.id;
    } else {
        //sara da generare pilota team e team season driver
        //creo il driver
        const driver_id = risultato.rider.id;

        const fullName = risultato.rider.full_name.split(' ');
        const name = fullName[0];
        const surname = fullName.slice(1).join(' ');

        const newDriver = await api.post('/drivers', {
            id: driver_id,
            name: name,
            surname: surname,
            code_driver: surname.substring(0, 3) + ' ' + name.substring(0, 1),
            country_id: await getCountryId(risultato.rider.country.iso),
            birthday: '01-01-1990'
        });

        //creo il team
        let team_id = uuidv4();
        const team = await api.get(`/teams?name=${risultato.team.name}`);

        if (!team.data) {
            const newTeam = await api.post('/teams', {
                id: team_id,
                name: risultato.team.name,
                color: '#000000'
            });
        } else {
            team_id = team.data[0].id;
        }

        //creo il team_season_driver
        const team_season_driver_id = uuidv4();
        const newTeamSeasonDriver = await api.post('/team-season-drivers', {
            id: team_season_driver_id,
            team_id: team_id,
            driver_id: driver_id,
            season_id: 2024,
            championship_id: championshipId,
            number: risultato.rider.number
        });

        return team_season_driver_id;
    }
}


//funzione che dato un codice iso3 prende l'id del country
async function getCountryId(iso2: string) {
    const country = (await api.get(`/countries?iso2=${iso2}`)).data;
    if (!country || country.length === 0) {
        console.log('country non trovato: ' + iso2);
        await new Promise(resolve => setTimeout(resolve, 40000));
        return null;
    }
    return country[0] ? country[0].id : null;
}
