const fs = require('fs');
const path = require('path');

// Prendi la lingua dal parametro della riga di comando o usa 'IT' come predefinito
const language = process.argv[2] || 'IT';

// Directory di base e directory di output
const baseDir = path.join(__dirname, '../src/app');
const i18nDir = path.join(__dirname, `../src/assets/i18n/${language}`);
const outputDir = path.join(__dirname, 'LabelManagment');
const excludeFilePath = path.join(__dirname, 'idml-to-exclude.json');

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
  const idmlKeysPath = path.join(outputDir, 'idml-used-into-html.json');
  fs.writeFileSync(idmlKeysPath, JSON.stringify(keysArray, null, 2));
  console.log(`Chiavi IDML salvate in ${idmlKeysPath}`);

  // Ottieni le chiavi esistenti e salvale in un nuovo file JSON
  const existingKeys = getExistingKeys();
  const existingKeysPath = path.join(outputDir, 'idml-declared.json');
  fs.writeFileSync(existingKeysPath, JSON.stringify(existingKeys, null, 2));
  console.log(`Chiavi già salvate in ${existingKeysPath}`);

  // Carica le chiavi da escludere
  const excludeKeys = loadExcludedKeys();

  // Calcola le chiavi dichiarate ma non usate e le chiavi usate ma non dichiarate
  let declaredButNotUsed = existingKeys.filter(key => !allKeys.has(key)).sort();
  const usedButNotDeclared = keysArray.filter(key => !existingKeys.includes(key)).sort();

  // Rimuovi le chiavi da escludere da 'declaredButNotUsed'
  declaredButNotUsed = declaredButNotUsed.filter(key => !excludeKeys.has(key));

  // Salva i risultati in due nuovi file JSON
  const declaredButNotUsedPath = path.join(outputDir, 'idml-declared-but-not-used.json');
  fs.writeFileSync(declaredButNotUsedPath, JSON.stringify(declaredButNotUsed, null, 2));
  console.log(`Chiavi dichiarate ma non usate salvate in ${declaredButNotUsedPath}`);

  const usedButNotDeclaredPath = path.join(outputDir, 'idml-used-but-not-declared.json');
  fs.writeFileSync(usedButNotDeclaredPath, JSON.stringify(usedButNotDeclared, null, 2));
  console.log(`Chiavi usate ma non dichiarate salvate in ${usedButNotDeclaredPath}`);
}

// Funzione per caricare le chiavi da escludere
function loadExcludedKeys() {
  if (fs.existsSync(excludeFilePath)) {
    try {
      const excludeContent = JSON.parse(fs.readFileSync(excludeFilePath, 'utf-8'));
      return new Set(excludeContent);
    } catch (error) {
      console.error(`Errore nel caricamento del file ${excludeFilePath}:`, error);
    }
  } else {
    console.warn(`File di esclusione non trovato: ${excludeFilePath}`);
  }
  return new Set();
}

// Esecuzione dello script
extractAndSaveKeysToFile();
