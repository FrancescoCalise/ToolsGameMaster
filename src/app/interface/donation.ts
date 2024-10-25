import { BaseDocument } from './models';

export interface Donation extends BaseDocument {
  lastDonation: Date | null;
}
