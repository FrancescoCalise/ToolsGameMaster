import { BaseDocument } from '../../../../../../interface/Document/BaseModel';

export interface CharacterSheetDND5ETemplate extends BaseDocument {
    sessionId?: string;
    name?: string;
}
