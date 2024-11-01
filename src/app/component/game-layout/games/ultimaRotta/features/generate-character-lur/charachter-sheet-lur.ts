import { BaseDocument } from '../../../../../../interface/Document/BaseModel';


export interface CharacterSheetLUR extends BaseDocument {
    name?: string;
    genetic: Genetic;
    excellence?: string;
    role?: Role;
    role_in_the_crew?: string;
    attributes: Attribute[];
    mana?: number;
    manaCurrent?: number;
    life?: number;
    lifeCurrent?: number;
    armor?: number;
    armorDetails?: ArmorDetails;
    inventory?: string[];
    scrap?: number;
    point_adventure?: number;
    background?: string;
    sessionId?: string;
    traits?: Trait[];
    ship?: string;
    redemption?: number;
}

export interface CharacterSheetLURHandlerPDF extends CharacterSheetLUR {
    genetic_and_role?: string;
    allAbilities?: string;
    allEquipment?: string;
}

export interface ArmorDetails {
    details?: ArmorInfo[];
}

export interface ArmorInfo {
    code: string
    notes?: string
    type?: string
    description?: string
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