var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fetch from "node-fetch";
import { supabase } from "./../config/config.js";
export function processPulseliveSession(item) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Chiamata per ottenere le stagioni
            const seasonsResponse = yield fetch("https://api.motogp.pulselive.com/motogp/v1/results/seasons");
            const seasons = (yield seasonsResponse.json());
            console.log("Stagioni ottenute:", seasons.length);
            // Prendi l'ID della stagione più recente
            const currentSeason = seasons.find(season => season.current) || seasons[0];
            const currentSeasonId = currentSeason.id;
            console.log('ID della stagione corrente:', currentSeasonId);
            const eventsResponse = yield fetch(`https://api.motogp.pulselive.com/motogp/v1/results/events/?seasonUuid=${currentSeasonId}`);
            const allEvents = yield eventsResponse.json();
            const eventiNonTest = allEvents.filter(event => !event.test);
            //crea un for che cicli ogni evento e stampi il nome con un console.log
            for (const event of eventiNonTest) {
                console.log(event.name);
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
        }
        catch (error) {
            console.error(`Errore nell'elaborazione dei risultati per ${item.championship}:`, error);
            // Crea un log di errore
            yield supabase
                .schema("dashboard")
                .from("queue_log")
                .insert({
                queue_id: item.id,
                log_type: "ERROR",
                error_message: error instanceof Error ? error.message : "Errore sconosciuto",
                error_stack: error instanceof Error ? error.stack : null,
            });
            throw error; // Rilancia l'errore per gestirlo nel chiamante
        }
    });
}
//# sourceMappingURL=pulseliveSession.js.map