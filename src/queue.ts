import Queue from 'bull';

const myQueue = new Queue('my-queue', 'redis://127.0.0.1:6379');

interface MotoGPEvent {
  circuit: {
    id: string;
  };
}

myQueue.process(async (job) => {
  try {
    const response = await fetch('https://api.motogp.pulselive.com/motogp/v1/results/events/?seasonUuid=dd12382e-1d9f-46ee-a5f7-c5104db28e43&isFinished=true');
    const data = await response.json() as MotoGPEvent[];

    if (Array.isArray(data) && data.length > 0) {
      console.log('Primo circuit ID:', data[0].circuit.id);
    } else {
      console.error('Dati non validi o array vuoto:', data);
    }
  } catch (error) {
    console.error('Errore durante la fetch:', error);
  }
});

export default myQueue;