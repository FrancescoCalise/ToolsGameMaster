import * as fs from 'fs';
import * as path from 'path';

// Dizionario di traduzione (esempio: aggiungi qui altre traduzioni)
const translations: { [key: string]: string } = {
    "Hello": "Ciao",
    "This is a sample JSON to be translated.": "Questo è un esempio di JSON da tradurre."
};

// Funzione ricorsiva per tradurre i valori in un JSON
function translateValues(obj: any): any {
    if (typeof obj === 'string') {
        return translations[obj] || obj; // Traduci il valore se esiste nel dizionario, altrimenti mantieni il valore originale
    }
    if (typeof obj === 'object' && obj !== null) {
        const translatedObj: any = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
            translatedObj[key] = translateValues(obj[key]); // Ricorsivo per oggetti annidati
        }
        return translatedObj;
    }
    return obj; // Restituisci il valore originale se non è una stringa o un oggetto
}

// Funzione principale per leggere il JSON, tradurlo e stampare il risultato
async function main() {
    const inputFilePath = path.resolve(process.argv[2]);

    try {
        const jsonData = JSON.parse(fs.readFileSync(inputFilePath, 'utf8'));
        const translatedJson = translateValues(jsonData);
        
        console.log("JSON tradotto:", JSON.stringify(translatedJson, null, 2));
    } catch (error) {
        console.error("Errore durante la lettura o la traduzione del JSON:", error);
    }
}

// Avvia lo script
main();
