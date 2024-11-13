import { Router } from 'express';
import processQueueApi from './process_queue.js';
import queueLogApi from './queue_log.js';
import driversApi from './drivers.js';
import resultsApi from './results.js';
import resultDriversApi from './resultDrivers.js';
import racesApi from './races.js';
import countriesApi from './countries.js';
import circuitsApi from './circuits.js';
import teamsApi from './teams.js';
import racesessionsApi from './racesessions.js';
import teamseasondriverApi from './teamseasondriver.js';
const router: Router = Router();

// Definisci le rotte per le code di processo
router.use('/process-queue', processQueueApi);
router.use('/queue-log', queueLogApi);
router.use('/drivers', driversApi);
router.use('/results', resultsApi);
router.use('/result-drivers', resultDriversApi);
router.use('/races', racesApi);
router.use('/circuits', circuitsApi);
router.use('/countries', countriesApi);
router.use('/racesessions', racesessionsApi);
router.use('/teams', teamsApi);
router.use('/team-season-drivers', teamseasondriverApi);
export default router;
