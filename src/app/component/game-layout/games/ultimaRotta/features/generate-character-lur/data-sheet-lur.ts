import { Attribute, Genetic, Role } from "./charachter-sheet-lur";

export const attributeKeys = [
    {
        code: 'AGILITY',
    },
    {
        code: 'COURAGE',
    },
    {
        code: 'STRENGTH',
    },
    {
        code: 'INTELLIGENCE',
    },
    {
        code: 'MAGIC',
    },
    {
        code: 'MANUALITY',
    },
    {
        code: 'PERCEPTION',
    },
    {
        code: 'SOCIALITY',
    },
] as Attribute[];

export const roles = [
    {
        code: 'LEADER',
        abilities: [
            {
                code: 'ADDESTRAMENTO_MILITARE',
            },
            {
                code: 'AUTOCONTROLLO',
            },
            {

                code: 'COMPETENZE_UNIVERSALI',
            },
            {
                code: 'IMPARTIRE_COMANDI',
            },
            {
                code: 'NESSUNA_PAURA',
            },
            {
                code: 'RESISTERE',
            },
            {
                code: 'STRATEGIA_E_TATTICA',
            },
            {
                code: 'UFFICIALE_SCIENTIFICO',
            },
            {
                code: 'ULTIMO_BASTIONE',
            }
        ]
    },
    {
        code: 'SOLDATO',
    },
    {
        code: 'CANAGLIA',
    },
    {
        code: 'RICOGNITORE',
    },
    {
        code: 'ARCANISTA',
    },
    {
        code: 'DISCEPOLO_OSCURO'
    }
] as Role[];

export const genetic = [
    {
        code: 'BIOS',
        abilities: [
            {
                code: 'ARMATURA_NATURALE'
            },
            {
                code: 'ARTIFICIALE'
            },
            {
                code: 'NANOMACCHINE'
            },
            {
                code: 'PROTOCOLLO_OPERATIVO_VARIABILE'
            }
        ]
    },
    {
        code: 'NOMADE',
        abilities: [
            {
                code: 'IGNORATO_DALLA_MORTE'
            },
            {
                code: 'SECONDA_SCORTA'
            },
            {
                code: 'SUSSURRI'
            }
        ]
    },
    {
        code: 'UMANOIDE',
        genes: ['U', 'E', 'N'],
        abilities:
        [
            {
                code: 'FORTUNA'       
            },
            {
                code: 'SUPERARE_LIMITE'
            },
            {
                code: 'IMMUNITA'
            },
            {
                code: 'MANA_SELVAGGIO'
            },
            {
                code: 'SANGUE_GIOVANE'
            },
            {
                code: 'COMBATTENTE_GRANITICO'
            },
            {
                code: 'TEMPRATO'
            },
            {
                code: 'STIMARE'
            }
        ]
    }
] as Genetic[];


export const mapIdGenetic: { [key: string]: number[] } = {
    "BIOS": [1, 2],
    "NOMADE": [3, 4],
    "UMANOIDE": [5, 6]
};

export const geneticTraceMapping: { [key: string]: number[] } = {
    'E': [1, 2],
    'N': [3, 4],
    'U': [5, 6]
};

