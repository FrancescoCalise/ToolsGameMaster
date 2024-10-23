import { BaseDocument } from './models';

export interface Item extends BaseDocument {
  name: string;
  description: string;
}
