var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import api from './../config/axiosConfig.js';
import { v4 as uuidv4 } from 'uuid';
//codeunit che gestisce i drivers / team_season_drivers / teams
export function insertDriver(risultato, championshipId) {
    return __awaiter(this, void 0, void 0, function* () {
        const driver = yield api.get(`/drivers/teamseasondriver-by-number?driverNumber=${risultato.rider.number}&championshipId=${championshipId}`);
        if (driver.data) {
            return driver.data.id;
        }
        else {
            //sara da generare pilota team e team season driver
            //creo il driver
            const driver_id = risultato.rider.id;
            const fullName = risultato.rider.full_name.split(' ');
            const name = fullName[0];
            const surname = fullName.slice(1).join(' ');
            const newDriver = yield api.post('/drivers', {
                id: driver_id,
                name: name,
                surname: surname,
                code_driver: surname.substring(0, 3) + ' ' + name.substring(0, 1),
                country_id: yield getCountryId(risultato.rider.country.iso),
                birthday: '01-01-1990'
            });
            //creo il team
            let team_id = uuidv4();
            const team = yield api.get(`/teams?name=${risultato.team.name}`);
            if (!team.data) {
                const newTeam = yield api.post('/teams', {
                    id: team_id,
                    name: risultato.team.name,
                    color: '#000000'
                });
            }
            else {
                team_id = team.data[0].id;
            }
            //creo il team_season_driver
            const team_season_driver_id = uuidv4();
            const newTeamSeasonDriver = yield api.post('/team-season-drivers', {
                id: team_season_driver_id,
                team_id: team_id,
                driver_id: driver_id,
                season_id: 2024,
                championship_id: championshipId,
                number: risultato.rider.number
            });
            return team_season_driver_id;
        }
    });
}
//funzione che dato un codice iso3 prende l'id del country
function getCountryId(iso2) {
    return __awaiter(this, void 0, void 0, function* () {
        const country = (yield api.get(`/countries?iso2=${iso2}`)).data;
        if (!country || country.length === 0) {
            console.log('country non trovato: ' + iso2);
            yield new Promise(resolve => setTimeout(resolve, 40000));
            return null;
        }
        return country[0] ? country[0].id : null;
    });
}
//# sourceMappingURL=driverManagement.js.map