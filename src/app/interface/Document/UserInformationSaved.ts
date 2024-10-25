import { Timestamp } from 'firebase/firestore';
import { BaseDocument } from './BaseModel';

export interface UserInformationSaved extends BaseDocument {
  role: RoleType;
  email: string;
  lastDonation: Timestamp | null;
}

export enum RoleType {
  User = 'user',
  master = 'master',
  Admin = 'admin'
}