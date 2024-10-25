import { Timestamp } from 'firebase/firestore';
import { BaseDocument } from './models';

export interface Donation extends BaseDocument {
  lastDonation: Timestamp | null;
}
