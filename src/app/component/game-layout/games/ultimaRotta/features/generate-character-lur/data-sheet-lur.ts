import { ArmorInfo, Attribute, Genetic, Role, Trait } from "./charachter-sheet-lur";

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
                code: 'ADDESTRAMENTO_MEDICO'
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
        abilities: [
            {
                code: 'ADDESTRAMENTO_BRUTALE',
            },
            {
                code: 'ARMA_LEATA',
            },
            {

                code: 'STRONCARE',
            },
            {
                code: 'RIFLESSI',
            },
            {
                code: 'SCUDO_UMANO',
            },
            {
                code: 'FISICO_POSSENTE',
            },
            {
                code: 'FUOCO_PESANTE',
            },
            {
                code: 'RABBIOSO',
            },
            {
                code: 'TANK',
            },
            {
                code: 'UNO_CONTRO_MOLTI',
            }
        ]
    },
    {
        code: 'CANAGLIA',
        abilities: [
            {
                code: 'ASSASINARE',
            },
            {
                code: 'ATTACCO_A_TRADIMENTO',
            },
            {

                code: 'VECCHIO_CONTATTO',
            },
            {
                code: 'FULMINEO',
            },
            {
                code: 'IMPREVEDIBILE'
            },
            {
                code: 'INAFFERRABILE',
            },
            {
                code: 'MAESTRIA_NELL_INGANNO',
            },
            {
                code: 'MECCANISMI',
            },
            {
                code: 'SALVARSI_IN_EXTREMIS',
            },
            {
                code: 'SECONDA_CHANCE',
            }
        ]
    },
    {
        code: 'RICOGNITORE',
        abilities: [
            {
                code: 'ACCORTO',
            },
            {
                code: 'AVANGUARDIA',
            },
            {

                code: 'COLPO_DA_CECCHINO',
            },
            {
                code: 'IMPATTO_CONTROLLATO',
            },
            {
                code: 'ESPLORAZIONE'
            },
            {
                code: 'FUOCO_IN_MOVIMENTO',
            },
            {
                code: 'INESORABILE',
            },
            {
                code: 'ARMA_LETALE',
            },
            {
                code: 'PILOTARE',
            },
            {
                code: 'BRANCO_DI_LUPI',
            }
        ]
    },
    {
        code: 'ARCANISTA',
        abilities: [
            {
                code: 'CATENA_PSICHICA',
            },
            {
                code: 'DISCIPLINA_PSICHICA',
            },
            {
                code: 'EMPATIA',
            },
            {
                code: 'POTERE_ARACANO_GUARIGIONE',
            },
            {
                code: 'POTERE_ARACANO_ONDA_MENTALE'
            },
            {
                code: 'POTERE_ARACANO_PIROCINESI',
            },
            {
                code: 'POTERE_ARACANO_PRECOGNIZIONE',
            },
            {
                code: 'POTERE_ARACANO_INVICIBILITA',
            },
            {
                code: 'POTERE_ARACANO_DOMINIO',
            },
            {
                code: 'POTERE_ARACANO_TELETRASPORTO',
            }
        ]
    },
    {
        code: 'DISCEPOLO_OSCURO',
        abilities: [
            {
                code: 'LADRO_D_ANIME',
            },
            {
                code: 'PREZZO_DEL_POTERE',
            },
            {

                code: 'POTERE_OSCURO_SFORTUNA',
            },
            {
                code: 'POTERE_OSCURO_INGANNO_MENTALE',
            },
            {
                code: 'POTERE_OSCURO_ESPLOSIONE_DELL_ANIMA'
            },
            {
                code: 'POTERE_OSCURO_DOLORE',
            },
            {
                code: 'POTERE_OSCURO_MORTE',
            },
            {
                code: 'POTERE_OSCURO_SERVO_DEL_POTERE',
            },
            {
                code: 'POTERE_OSCURO_TERRPRE',
            },
            {
                code: 'RITO_SACRIFICALE',
            }
        ]
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

export const traits = [
    {
        code: "CICATRICE"
    },
    {
        code: "INCUBO"
    },
    {
        code: "MALATO_DIFETTOSO"
    },
    {
        code: "SANGUINARIO"
    },
    {
        code: "VENDICATIVO"
    },
    {
        code: "RUOLO_FACILITATO_LEADER_O_SOLDATO"
    },
    {
        code: "RUOLO_FACILITATO_CANAGLIA_O_RICOGNITORE"
    },
    {
        code: "RUOLO_FACILITATO_ARCANISTA_O_DISCEPOLO_OSCURO"
    },
    {
        code: "AGIATO"
    },
    {
        code: "SPIETATO"
    },
    {
        code: "FRONT_MAN"
    },
    {
        code: "ROTTMATORE"
    },
    {
        code: "SEI_PROPRIO_GROSSO"
    },
    {
        code: "HAI_UNA_SCINTILLA"
    },
    {
        code: "TALENTO_NATURALE"
    },
    {
        code: "ARMA_EXTRA_1"
    },
    {
        code: "ARMA_EXTRA_2"
    },
    {
        code: "DUE_VITE"
    },
    {
        code: "GENETICA_MISTA"
    },
    {
        code: "TIRA_DUE_VOLTE"
    }
] as Trait[];

export const armorDetails = [
    {
        code: 'BODY',
        type: '',
        notes: ''
    },
    {
        code: 'HEAD',
        type: '',
        notes: ''
    },
    {
        code: 'ARM_LEFT',
        type: '',
        notes: ''
    },
    {
        code: 'ARM_RIGHT',
        type: '',
        notes: ''
    },
    {
        code: 'LEG_LEFT',
        type: '',
        notes: ''
    },
    {
        code: 'LEG_RIGHT',
        type: '',
        notes: ''
    }
] as ArmorInfo[];

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

export const traitTraceMapping: { [key: string]: number } = {
    'CICATRICE': 1,
    'INCUBO': 2,
    'MALATO_DIFETTOSO': 3,
    'SANGUINARIO': 4,
    'VENDICATIVO': 5,
    'RUOLO_FACILITATO_LEADER_O_SOLDATO': 6,
    'RUOLO_FACILITATO_CANAGLIA_O_RICOGNITORE': 7,
    'RUOLO_FACILITATO_ARCANISTA_O_DISCEPOLO_OSCURO': 8,
    'AGIATO': 9,
    'SPIETATO': 10,
    'FRONT_MAN': 11,
    'ROTTMATORE': 12,
    'SEI_PROPRIO_GROSSO': 13,
    'HAI_UNA_SCINTILLA': 14,
    'TALENTO_NATURALE': 15,
    'ARMA_EXTRA_1': 16,
    'ARMA_EXTRA_2': 17,
    'DUE_VITE': 18,
    'GENETICA_MISTA': 19,
    'TIRA_DUE_VOLTE': 20
};

export const roleTraceMapping: { [key: string]: number } = {
    'LEADER': 1,
    'SOLDATO': 2,
    'CANAGLIA': 3,
    'RICOGNITORE': 4,
    'ARCANISTA': 5,
    'DISCEPOLO_OSCURO': 6
}
