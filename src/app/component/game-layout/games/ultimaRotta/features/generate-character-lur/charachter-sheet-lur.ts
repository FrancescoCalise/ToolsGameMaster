import { BaseDocument } from '../../../../../../interface/Document/BaseModel';

export interface CharacterSheetLURTemplate extends BaseDocument {
    name?: string;
    excellence?: string;
    genetic_and_role?: string;
    role_in_the_crew?: string;
    attributes?: Attribute[];
    mana?: number;
    manaCurrent?: number;
    life?: number;
    lifeCurrent?: number;
    armor?: number;
    armorDetails?: ArmorInfo[];
    allEquipment?: string;
    scrap?: number;
    point_adventure?: number;
    background?: string;
    sessionId?: string;
    ship?: string;
    redemption?: number;
    allAbilities?:string 
}

export interface CharacterSheetLUR{
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
    armorDetails?: ArmorInfo[];
    inventory?: string[];
    scrap?: number;
    point_adventure?: number;
    background?: string;
    traits?: Trait[];
    ship?: string;
    redemption?: number;
}

export interface ArmorInfo {
    code: string
    notes?: string
    type?: string
    description?: string
}

export interface Attribute {
    code?: string;
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