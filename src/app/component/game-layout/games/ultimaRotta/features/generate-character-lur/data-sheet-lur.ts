import { Attribute, Genetic, Role } from "./charachter-sheet-lur";

export const attributeKeys = [
    {
        id: 1,
        code: 'AGILITY',
        description: '',
    },
    {
        id: 2,
        code: 'COURAGE',
        description: '',
    },
    {
        id: 3,
        code: 'STRENGTH',
        description: '',
    },
    {
        id: 4,
        code: 'INTELLIGENCE',
        description: '',
    },
    {
        id: 5,
        code: 'MAGIC',
        description: '',
    },
    {
        id: 6,
        code: 'MANUALITY',
        description: '',
    },
    {
        id: 7,
        code: 'PERCEPTION',
        description: '',
    },
    {
        id: 8,
        code: 'SOCIALITY',
        description: '',
    },
] as Attribute[];

export const roles = [
    {
        id: 1,
        description: '',
        code: 'LEADER',
        abiliies: [
            {
                id: 1,
                description: '',
                code: 'ADDESTRAMENTO_MILITARE',
            },
            {
                id: 2,
                description: '',
                code: 'AUTOCONTROLLO',
            },
            {
                id: 3,
                description: '',
                code: 'COMPETENZE_UNIVERSALI',
            },
            {
                id: 4,
                description: '',
                code: 'IMPARTIRE_COMANDI',
            },
            {
                id: 5,
                description: '',
                code: 'NESSUNA_PAURA',
            },
            {
                id: 6,
                description: '',
                code: 'RESISTE',
            },
            {
                id: 7,
                description: '',
                code: 'STRATEGIA_E_TATTICA',
            },
            {
                id: 8,
                description: '',
                code: 'UFFICIALE_SCIENTIFICO',
            },
            {
                id: 9,
                description: '',
                code: 'ULTIMO_BASTIONE',
            }
        ]
    },
    {
        id: 2,
        description: '',
        code: 'SOLDATO',
    },
    {
        id: 3,
        description: '',
        code: 'CANAGLIA',
    },
    {
        id: 4,
        description: '',
        code: 'RICOGNITORE',
    },
    {
        id: 5,
        description: '',
        code: 'ARCANISTA',
    },
    {
        id: 6,
        description: '',
        code: 'DISCEPOLO_OSCURO'
    }
] as Role[];

export const genetic = [
    {
        id: 1,
        description: '',
        code: 'BIOS',
    },
    {
        id: 2,
        description: '',
        code: 'NOMADE',
    },
    {
        id: 3,
        description: '',
        code: 'UMANOIDE',
    }
] as Genetic[];
