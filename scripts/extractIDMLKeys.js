const fs = require('fs');
const path = require('path');

// Prendi la lingua dal parametro della riga di comando o usa 'IT' come predefinito
const language = process.argv[2] || 'IT';

// Directory di base e directory di output
const baseDir = path.join(__dirname, '../src/app');
const i18nDir = path.join(__dirname, `../src/assets/i18n/${language}`);
const outputDir = path.join(__dirname, 'LabelManagment');

// Creazione della directory di output se non esiste
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Funzione ricorsiva per trovare file HTML all'interno delle cartelle 'component' e 'shared'
function findHTMLFilesRecursively(dir) {
  let htmlFiles = [];

  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.lstatSync(filePath);

    if (stat.isDirectory()) {
      // Ricorsivamente cerca nelle sottocartelle
      htmlFiles = htmlFiles.concat(findHTMLFilesRecursively(filePath));
    } else if (stat.isFile() && path.extname(file) === '.html') {
      // Aggiungi file HTML trovato
      htmlFiles.push(filePath);
    }
  });

  return htmlFiles;
}

// Funzione per estrarre chiavi di traduzione da contenuto HTML
function extractTranslationKeys(htmlContent) {
  const idmlKeys = new Set();
  const translationRegex = /\{\{\s*'(.+?)'\s*\|\s*translate\s*\}\}/g;

  let match;
  while ((match = translationRegex.exec(htmlContent)) !== null) {
    idmlKeys.add(match[1]);
  }

  return Array.from(idmlKeys);
}

// Funzione per ottenere le chiavi già salvate dai file JSON in 'src/assets/i18n/{lang}'
function getExistingKeys() {
  const existingKeys = new Set();

  // Verifica se la directory esiste prima di procedere
  if (!fs.existsSync(i18nDir)) {
    console.error(`Directory not found: ${i18nDir}`);
    return Array.from(existingKeys); // ritorna un array vuoto
  }

  function collectKeys(obj, prefix = '') {
    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object') {
        collectKeys(obj[key], fullKey);
      } else {
        existingKeys.add(fullKey);
      }
    }
  }

  fs.readdirSync(i18nDir).forEach(file => {
    const filePath = path.join(i18nDir, file);
    if (path.extname(file) === '.json') {
      const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      collectKeys(fileContent);
    }
  });

  return Array.from(existingKeys).sort();
}

// Funzione principale per estrarre le chiavi dai file HTML e salvare sia le chiavi estratte che quelle esistenti
function extractAndSaveKeysToFile() {
  const componentsDir = path.join(baseDir, 'component');
  const sharedDir = path.join(baseDir, 'shared');
  const allKeys = new Set();

  // Trova tutti i file HTML nelle cartelle 'component' e 'shared'
  const htmlFiles = [
    ...findHTMLFilesRecursively(componentsDir),
    ...findHTMLFilesRecursively(sharedDir)
  ];

  htmlFiles.forEach(filePath => {
    const htmlContent = fs.readFileSync(filePath, 'utf-8');
    const keys = extractTranslationKeys(htmlContent);
    keys.forEach(key => allKeys.add(key));
  });

  // Converte il set di chiavi in un array, ordina in ordine alfabetico e salva in JSON
  const keysArray = Array.from(allKeys).sort();
  const idmlKeysPath = path.join(outputDir, 'idmlKeys.json');
  fs.writeFileSync(idmlKeysPath, JSON.stringify(keysArray, null, 2));
  console.log(`Chiavi IDML salvate in ${idmlKeysPath}`);

  // Ottieni le chiavi esistenti e salvale in un nuovo file JSON
  const existingKeys = getExistingKeys();
  
  const existingKeysPath = path.join(outputDir, language + '-' + 'keyAlreadySaved.json');
  fs.writeFileSync(existingKeysPath, JSON.stringify(existingKeys, null, 2));
  console.log(`Chiavi già salvate in ${existingKeysPath}`);
}

// Esecuzione dello script
extractAndSaveKeysToFile();
