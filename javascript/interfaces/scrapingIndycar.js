var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import puppeteer from 'puppeteer';
function esploraClassificaIndyCar() {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer.launch({ headless: false });
        const page = yield browser.newPage();
        console.log('Navigando verso la pagina...');
        yield page.goto('https://www.indycar.com/Results', { waitUntil: 'networkidle0' });
        console.log('Pagina caricata');
        try {
            console.log('Aspettando il selettore .standings-table...');
            yield page.waitForSelector('.standings-table', { timeout: 30000 });
            console.log('Selettore trovato');
            const classificaHTML = yield page.evaluate(() => {
                const resultsElement = document.querySelector('.standings-table');
                return resultsElement ? resultsElement.innerHTML : null;
            });
            console.log('Contenuto della classifica:', classificaHTML ? 'Trovato' : 'Non trovato');
            const piloti = yield page.evaluate(() => {
                const pilotiElements = document.querySelectorAll('.standings-table .name');
                return Array.from(pilotiElements).map(el => { var _a; return (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim(); });
            });
            console.log('Piloti:', piloti);
        }
        catch (error) {
            console.error('Si è verificato un errore:', error);
        }
        finally {
            console.log('Chiusura del browser');
            yield browser.close();
        }
    });
}
esploraClassificaIndyCar();
//# sourceMappingURL=scrapingIndycar.js.map