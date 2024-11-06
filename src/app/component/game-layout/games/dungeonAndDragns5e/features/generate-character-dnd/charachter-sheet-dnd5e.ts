import { BaseDocument } from '../../../../../../interface/Document/BaseModel';

export interface CharacterSheetDND5ETemplate extends BaseDocument {
    sessionId?: string;
    CharacterName?: string | null;
    Class?: string;
    Level?: number;
    Race?: string;
    Background?: string;
    Alignment?: string;
    Gender?: string;
    STR?: number;
    STRmod?: number;
    DEX?: number;
    DEXmod?: number;
    CON?: number;
    CONmod?: number;
    INT?: number;
    INTmod?: number;
    WIS?: number;
    WISmod?: number;
    CHA?: number;
    CHAmod?: number;
    ProficiencyBonus?: number;
    HPMax?: number;
    AC?: number;
    Initiative?: number;
    Speed?: number;
    WeaponProfency?: string;
    ToolsProfency?: string;
    Languages?: string;
    RacialTraits?: string;
    BackgroundFeature?: string;
    ClassPrivilegs?: string;
}

export function initializeCharacterSheet(): CharacterSheetDND5ETemplate {
    return {
        sessionId: '',
        CharacterName: '',
        Class: '',
        Level: 0,
        Race: '',
        Background: '',
        Alignment: '',
        Gender: '',
        STR: 0,
        STRmod: 0,
        DEX: 0,
        DEXmod: 0,
        CON: 0,
        CONmod: 0,
        INT: 0,
        INTmod: 0,
        WIS: 0,
        WISmod: 0,
        CHA: 0,
        CHAmod: 0,
        ProficiencyBonus: 0,
        HPMax: 0,
        AC: 0,
        Initiative: 0,
        Speed: 0,
        WeaponProfency: '',
        ToolsProfency: '',
        Languages: '',
        RacialTraits: '',
        BackgroundFeature: '',
        ClassPrivilegs: ''
    };
}