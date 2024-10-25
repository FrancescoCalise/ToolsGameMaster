import { FieldValue } from "firebase/firestore";

export interface BaseDocument {
    id?: string;
    ownerId?: string;
    creationDate?: FieldValue;
    lastUpdateDate?: FieldValue;
  }
  