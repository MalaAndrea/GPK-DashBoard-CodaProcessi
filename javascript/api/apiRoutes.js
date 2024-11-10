import { Router } from 'express';
import processQueueApi from './process_queue.js';
import queueLogApi from './queue_log.js';
import driversApi from './drivers.js';
import resultsApi from './results.js';
import resultDriversApi from './resultDrivers.js';
import racesApi from './races.js';
const router = Router();
// Definisci le rotte per le code di processo
router.use('/process-queue', processQueueApi);
router.use('/queue-log', queueLogApi);
router.use('/drivers', driversApi);
router.use('/results', resultsApi);
router.use('/result-drivers', resultDriversApi);
router.use('/races', racesApi);
export default router;
//# sourceMappingURL=apiRoutes.js.map