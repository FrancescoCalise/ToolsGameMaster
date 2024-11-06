export interface Monster {
    name: string;
    size: string;
    type: string;
    alignment: string;
    armorClass: string;
    hitPoints: string;
    speed: string;
    attributes: {
      strength: number;
      dexterity: number;
      constitution: number;
      intelligence: number;
      wisdom: number;
      charisma: number;
    };
    savingThrows: {
      strength: string;
      dexterity: string;
      constitution: string;
      intelligence: string;
      wisdom: string;
      charisma: string;
    };
    skills: string[];
    damageResistances: string;
    damageVulnerabilities: string;
    damageImmunities: string;
    conditionImmunities: string;
    senses: string;
    passivePerception: number;
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
      level: number;
      spellName: string;
    }>;
    spellSlots: number[];
}
  

export function createEmptyMonster(): Monster {
    return {
      name: '',
      size: '',
      type: '',
      alignment: '',
      armorClass: '',
      hitPoints: '',
      speed: '',
      attributes: {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0
      },
      savingThrows: {
        strength: '',
        dexterity: '',
        constitution: '',
        intelligence: '',
        wisdom: '',
        charisma: ''
      },
      skills: [],
      damageResistances: '',
      damageVulnerabilities: '',
      damageImmunities: '',
      conditionImmunities: '',
      senses: '',
      passivePerception: 0,
      languages: '',
      challengeRating: '',
      traits: [], // Array vuoto
      actions: [], // Array vuoto
      legendaryActions: [], // Array vuoto
      spells: [], // Array vuoto
      spellSlots: [] // Array vuoto
    };
}
  