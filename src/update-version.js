// update-version.js
const fs = require('fs');
const path = require('path');

// Leggi la data e l'ora corrente
const now = new Date();
const version = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}.${now.getHours()}${now.getMinutes()}`;

// Percorsi per i file di ambiente
const environments = ['app/environments/environment.ts', 'app/environments/environment.prod.ts'];

environments.forEach(filePath => {
  const absolutePath = path.resolve(__dirname, filePath);
  let fileContent = fs.readFileSync(absolutePath, 'utf8');
  
  // Sostituisci la versione nel file
  fileContent = fileContent.replace(/version: '.*?'/, `version: '${version}'`);
  
  // Sovrascrivi il file con il nuovo contenuto
  fs.writeFileSync(absolutePath, fileContent, 'utf8');
  console.log(`Updated version in ${filePath} to ${version}`);
});
