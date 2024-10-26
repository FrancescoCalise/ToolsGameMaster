import { Timestamp } from "firebase/firestore";
import { BaseDocument } from "./BaseModel";

// error-log.interface.ts
export interface ErrorLog extends BaseDocument {
    errorCode: string;           // Codice univoco dell'errore (es. generato con uuid)
    message: string;         // Descrizione dettagliata dell'errore
    timestamp: Timestamp;             // Timestamp dell'errore
    environment: string; // Ambiente in cui si è verificato l'errore ("test" o "prod")
    version: string;             // Versione dell'applicazione
  }
  