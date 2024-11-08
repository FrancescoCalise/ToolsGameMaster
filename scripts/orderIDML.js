const fs = require('fs');
const path = require('path');

// Prende la lingua come argomento dalla riga di comando
const language = process.argv[2];
if (!language) {
  console.error('Errore: specificare una lingua come parametro, ad esempio: node orderIDML.js IT');
  process.exit(1);
}

const i18nDir = path.join(__dirname, `../src/assets/i18n/${language}`);

// Funzione per ordinare un oggetto per chiave in modo ricorsivo
function sortObject(obj) {
  const sortedObj = {};
  const keys = Object.keys(obj).sort();

  keys.forEach(key => {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      sortedObj[key] = sortObject(obj[key]);
    } else {
      sortedObj[key] = obj[key];
    }
  });

  return sortedObj;
}

// Funzione principale per leggere, ordinare e sovrascrivere i file JSON
function orderIDMLFiles() {
  // Verifica che la directory esista
  if (!fs.existsSync(i18nDir)) {
    console.error(`Errore: la directory ${i18nDir} non esiste.`);
    process.exit(1);
  }

  // Processa tutti i file JSON nella directory
  fs.readdirSync(i18nDir).forEach(file => {
    const filePath = path.join(i18nDir, file);

    // Controlla se è un file JSON
    if (path.extname(file) === '.json') {
      try {
        const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const sortedContent = sortObject(fileContent);

        // Sovrascrive il file con il contenuto ordinato
        fs.writeFileSync(filePath, JSON.stringify(sortedContent, null, 2));
        console.log(`File ordinato: ${filePath}`);
      } catch (error) {
        console.error(`Errore nella lettura o scrittura del file ${filePath}:`, error);
      }
    }
  });
}

// Esecuzione dello script
orderIDMLFiles();
