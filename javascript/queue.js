var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Queue from 'bull';
const myQueue = new Queue('my-queue', 'redis://127.0.0.1:6379');
myQueue.process((job) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch('https://api.motogp.pulselive.com/motogp/v1/results/events/?seasonUuid=dd12382e-1d9f-46ee-a5f7-c5104db28e43&isFinished=true');
        const data = yield response.json();
        if (Array.isArray(data) && data.length > 0) {
            console.log('Primo circuit ID:', data[0].circuit.id);
        }
        else {
            console.error('Dati non validi o array vuoto:', data);
        }
    }
    catch (error) {
        console.error('Errore durante la fetch:', error);
    }
}));
export default myQueue;
//# sourceMappingURL=queue.js.map