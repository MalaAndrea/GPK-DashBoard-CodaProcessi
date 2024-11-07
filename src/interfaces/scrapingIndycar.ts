import puppeteer from 'puppeteer';

async function esploraClassificaIndyCar() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Navigando verso la pagina...');
  await page.goto('https://www.indycar.com/Results', { waitUntil: 'networkidle0' });
  console.log('Pagina caricata');

  try {
    console.log('Aspettando il selettore .standings-table...');
    await page.waitForSelector('.standings-table', { timeout: 30000 });
    console.log('Selettore trovato');

    const classificaHTML = await page.evaluate(() => {
      const resultsElement = document.querySelector('.standings-table');
      return resultsElement ? resultsElement.innerHTML : null;
    });

    console.log('Contenuto della classifica:', classificaHTML ? 'Trovato' : 'Non trovato');

    const piloti = await page.evaluate(() => {
      const pilotiElements = document.querySelectorAll('.standings-table .name');
      return Array.from(pilotiElements).map(el => el.textContent?.trim());
    });

    console.log('Piloti:', piloti);
  } catch (error) {
    console.error('Si è verificato un errore:', error);
  } finally {
    console.log('Chiusura del browser');
    await browser.close();
  }
}

esploraClassificaIndyCar();