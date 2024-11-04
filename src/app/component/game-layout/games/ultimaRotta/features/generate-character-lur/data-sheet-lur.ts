import { ArmorInfo, Attribute, Genetic, ItemLUR, Role, Trait } from "./charachter-sheet-lur";

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

export const codeItemTableLUR = [
    {
        code : 'WEAPON_1',
    },
    {
        code: 'WEAPON_2',
    },
    {
        code: 'EQUIP_1',
    },
    {
        code: 'EQUIP_2',
    },
    {
        code: 'CLOTHES'
    },
    {
        code:'SUSTENANCE'
    },
    {
        code: 'MECHANIC_KIT'
    },
    {
        code: 'SCRAPS'
    }
] as ItemLUR[];

export const CLOTHES: { [key: number]: string } = {
    1: "CAMBIO_CON_ABITI_SPORCHI",
    2: "CAMBIO_CON_ABITI_PULITI",
    3: "CAMBIO_CON_ABITI_ELEGANTI",
    4: "CASCO",
    5: "PEZZO_DI_ARMATURA_A_SCELTA",
    6: "PEZZO_DI_ARMATURA_E_CASCO",
    7: "ABITI_ELEGANTI_E_CASCO_COM",
    8: "TUTA_NANOGUARDIA_PIU_2_PS"
  };
  
  export const WEAPON_1: { [key: number]: string } = {
    1: "NULLA",
    2: "TIRAPUGNI",
    3: "COLTELLO",
    4: "SPADA_CORTA",
    5: "MAZZA_DA_GUERRA",
    6: "SPADA_LUNGA",
    7: "ASCIA_DA_GUERRA",
    8: "FULMILAMA"
  };
  
  export const WEAPON_2: { [key: number]: string } = {
    1: "NULLA",
    2: "SPARACHIODI_MINORE_CON_1D6_COLPI",
    3: "SPARACHIODI_MINORE_CON_2D6_COLPI",
    4: "SPARACHIODI_RAPIDO_CON_1D6_COLPI",
    5: "SPARACHIODI_RAPIDO_CON_2D12_COLPI",
    6: "SPARACHIODI_PESANTE_CON_1D6_COLPI",
    7: "SPARACHIODI_PESANTE_CON_2D6_COLPI",
    8: "SPARALAMPO_SCARICA"
  };
  
  export const EQUIP_1: { [key: number]: string } = {
    1: "ZAINO",
    2: "ATTREZZI_DA_SCASSO",
    3: "MEDIKIT_1D6_UTILIZZI",
    4: "KIT_DA_MECCANICO",
    5: "ACCENDINO_E_7_SIGARI",
    6: "TORCIA_DA_CASCO_O_DA_CINTURA",
    7: "BINOCOLLO_NO_XE",
    8: "COM"
  };
  
  export const EQUIP_2: { [key: number]: string } = {
    1: "FIALA_DI_VELENO",
    2: "CORDA_10M",
    3: "COPERTA_DI_LANA",
    4: "SCUDO",
    5: "FIALA_DI_POX",
    6: "PISTOLA_RAMPO_CAVO_5M",
    7: "DISPOSITIVO_APRISKAM",
    8: "STIVALI_RAGNO"
  };
  
  export const SUSTENANCE: { [key: number]: string } = {
    1: "ANTIDOTO",
    2: "BORRACCIA",
    3: "RAZIONI_LIOFILIZZATE_5",
    4: "BORRACCIA_E_RAZIONI_5",
    5: "FIALA_DI_VITA",
    6: "FIALA_DI_MANA",
    7: "KIT_EXOCAMP",
    8: "ELETTROLITA"
  };
  
  export const ELETTROLITA: { [key: number]: string } = {
    1: "LIME",
    2: "GRANO",
    3: "BULBORAGNO",
    4: "SALTABECCO",
    5: "MENTA",
    6: "ORIGINAL"
  };
   
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
