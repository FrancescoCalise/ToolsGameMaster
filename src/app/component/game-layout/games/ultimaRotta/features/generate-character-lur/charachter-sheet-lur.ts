import { BaseDocument } from '../../../../../../interface/Document/BaseModel';

export interface CharacterAttribute {
    value: number;
    bonus: number;
}

export interface CharacterSheetLUR extends BaseDocument {
    name?: string;
    genetic?: string;
    excellence?: string;
    role?: string;
    attributes: {
        agility: CharacterAttribute;
        courage: CharacterAttribute;
        strength: CharacterAttribute;
        intelligence: CharacterAttribute;
        magic: CharacterAttribute;
        manuality: CharacterAttribute;
        perception: CharacterAttribute;
        sociality: CharacterAttribute;
    };
    maxMana?: number;
    currentMana?: number;
    maxLife?: number;
    currentLife?: number;
    armor?: number;
    ability?: string;
    inventory?: string;
    scrap?: string;
    point_adventure?: number;
    background?: string;
}

export interface Attribute {
    id: number;
    code: string;
    description: string;
}

export interface Ability {
    id: number;
    description: string;
    code: string;
}

export interface Role {
    id: number;
    description: string;
    code: string;
    abilities?: Ability[];
}

export interface Genetic {
    id: number;
    description: string;
    code: string;
}