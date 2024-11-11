import { BaseDocument } from "../../../../../interface/Document/BaseModel";

export interface PNG_5E extends BaseDocument {
  sessionId?: string;
  name: string;
  size: string;
  type: string;
  alignment: string;
  armorClass: string;
  hitPoints: string;
  speed: string;
  attributes: {
    strength?: number;
    dexterity?: number;
    constitution?: number;
    intelligence?: number;
    wisdom?: number;
    charisma?: number;
  };
  save:string;
  skills: string[];
  damageResistances: string;
  damageVulnerabilities: string;
  damageImmunities: string;
  conditionImmunities: string;
  senses: string;
  passivePerception?: number;
  languages: string;
  challengeRating: string;
  traits: Array<{
    name: string;
    description: string;
    attack: string;
  }>;
  actions: Array<{
    name: string;
    description: string;
    attack: string;
  }>;
  legendaryActions: Array<{
    name: string;
    description: string;
  }>;
  spells: Array<{
    level?: number;
    spellName: string;
  }>;
  spellSlots: number[];
}

export function createEmptyPng(): PNG_5E {
  return {
    name: '',
    size: '',
    type: '',
    alignment: '',
    armorClass: '',
    hitPoints: '',
    speed: '',
    attributes: {
      strength: undefined,
      dexterity: undefined,
      constitution: undefined,
      intelligence: undefined,
      wisdom: undefined,
      charisma: undefined
    },
    save:'',
    skills: [],
    damageResistances: '',
    damageVulnerabilities: '',
    damageImmunities: '',
    conditionImmunities: '',
    senses: '',
    passivePerception: undefined,
    languages: '',
    challengeRating: '',
    traits: [], // Array vuoto
    actions: [], // Array vuoto
    legendaryActions: [], // Array vuoto
    spells: [], // Array vuoto
    spellSlots: [] // Array vuoto
  };
}
