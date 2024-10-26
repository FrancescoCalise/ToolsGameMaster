import { FieldValue } from "firebase/firestore";

export interface BaseDocument {
  id?: string;
  ownerId?: string | null;
  creationDate?: FieldValue;
  lastUpdateDate?: FieldValue;
}
