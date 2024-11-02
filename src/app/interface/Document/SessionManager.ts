import { Timestamp } from 'firebase/firestore';
import { BaseDocument } from './BaseModel';

export interface SessionManager extends BaseDocument {
  sessionName?: string;
  gameName?: string;
  default: boolean;
}

