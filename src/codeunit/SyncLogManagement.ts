import { Tables } from '../lib/database.types';
import api from './../config/axiosConfig.js';

type sync_log = Tables<{ schema: 'dashboard' }, 'sync_log'>;
type sync_type = 'insert' | 'modify' | 'delete';

export async function insertLogDriverSync(driverId: string): Promise<number> {

    const driverResponse = await api.get(`/drivers?id=${driverId}`, {
        headers: { 'X-Database': 'staging' }
    });
    const { team_season_drivers, ...driver } = driverResponse.data;

    //da capire se il driver è già presente nel database produzione e se esiste sync_type = modify
    const driverExists = await api.get(`/prod/drivers?id=${driver.id}`, {
        headers: { 'X-Database': 'produzione' }
    });

    let sync_type: sync_type = 'insert';
    if (driverExists && driverExists.data) {
        sync_type = 'modify';
    }

    const nextId = await getNextAvailableId();
    const logEntry: sync_log = {
        id: nextId,
        code: 'DRIVER',
        description: `Sync log for driver: ${driver.name} ${driver.surname}`,
        record_type: 'drivers',
        record_id: driver.id,
        json_object: { driver },
        sync_type: sync_type,
        sync_status: 'pending',
        error_description: null
    };

    await insertLog(logEntry);
    return logEntry.id;
}



//funzione per aggiornare il log con l'errore
async function updateLogError(id: number, description: string) {
    await api.put(`/dashboard/syncLog/${id}`, { sync_status: 'error', error_description: description });
    throw new Error(description);
}

// Funzione  per l'inserimento nel database
async function insertLog(log: sync_log) {
    try {
        const response = await api.post('/dashboard/syncLog', log);
        console.log('Log inserito:', log);
    } catch (error) {
        console.error('Errore durante l\'inserimento del log:', error);
        throw new Error('Failed to insert log');
    }
}

// Funzione per ottenere il prossimo ID disponibile
export async function getNextAvailableId(): Promise<number> {
    try {
        const response = await api.get('/dashboard/syncLog/nextId');
        return response.data.nextId;
    } catch (error) {
        console.error('Errore durante il recupero del prossimo ID:', error);
        throw new Error('Failed to get next available ID');
    }
}
