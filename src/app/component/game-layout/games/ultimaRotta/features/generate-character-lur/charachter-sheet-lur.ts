import { BaseDocument } from '../../../../../../interface/Document/BaseModel';


export interface CharacterSheetLUR extends BaseDocument {
    name?: string;
    genetic: Genetic;
    excellence?: string;
    role?: Role;
    attributes: Attribute[];
    mana?: number;
    life?: number;
    armor?: number;
    inventory?: string;
    scrap?: number;
    point_adventure?: number;
    background?: string;
    sessionId?: string;
    traits?: Trait[];
}

export interface Attribute {
    code: string;
    description?: string;
    value?: number;
    bonus?: number; 
}

export interface Ability {
    description?: string;
    code: string;
    id: number;
}

export interface Role {
    description?: string;
    code: string;
    abilities: Ability[];
}

export interface Genetic {
    description?: string;
    code: string;
    abilities: Ability[];
    genes?: string[];
}

export interface Trait {
    description?: string;
    code: string;
}