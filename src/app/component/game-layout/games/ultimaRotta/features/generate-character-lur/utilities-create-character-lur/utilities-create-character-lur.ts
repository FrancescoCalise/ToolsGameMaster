import { RandomNameService } from '../../../../../../../services/randomNameService';
import {
    Ability,
    CharacterSheetLUR,
    Genetic,
    Role,
} from '../charachter-sheet-lur';
import {
    attributeKeys,
    genetic,
    geneticTraceMapping,
    mapIdGenetic,
    roles,
} from '../data-sheet-lur';

export class UtilitiesCreateCharacterLur {
    static readonly rolesDefaultData = roles;
    static readonly geneticDefaultData = genetic;
    static readonly attributeKeys = attributeKeys;

    constructor() { }

    private static generateRandomNumber(max: number): number {
        return Math.floor(Math.random() * max) + 1;
    }

    private static getRandomElement<T>(elements: T[]): T {
        return elements[Math.floor(Math.random() * elements.length)];
    }

    private static async getRandomName(
        randomNameService: RandomNameService
    ): Promise<string> {
        return (await randomNameService.getRandomName()) || '';
    }

    private static updateAttributes(
        attributes: any[],
        code: StatsType,
        increment: number
    ): void {
        const attribute = attributes.find((attr) => attr.code === code);
        if (attribute) {
            attribute.bonus = (attribute.bonus ?? 0) + increment;
        }
    }

    private static fillGeneticValues(newChar: CharacterSheetLUR,genetic: Genetic) {
        const defaultGenetics: {
            [key in GeneticType]: {
                life: number;
                mana: number;
                armor: number;
            } | null;
        } = {
            [GeneticType.Bios]: { life: 10, mana: 0, armor: 5 },
            [GeneticType.Nomade]: { life: 7, mana: 2, armor: 0 },
            [GeneticType.Umanoide]: null,
        };

        const applyGenetics = defaultGenetics[genetic.code as GeneticType];

        if (applyGenetics) {
            newChar.life = applyGenetics.life;
            newChar.mana = applyGenetics.mana;
            newChar.armor = applyGenetics.armor;
        }

        switch (genetic.code) {
            case GeneticType.Nomade:
                this.applyNomadeGenetics(newChar);
                break;
            case GeneticType.Umanoide:
                this.applyUmanoideGenetics(newChar);
                break;
        }
    }

    private static applyNomadeGenetics(newChar: CharacterSheetLUR): void {
        const randomStats = this.getTwoDistinctRandomNumbers(8);
        randomStats.forEach((statIndex) => {
            const attribute = newChar.attributes?.[statIndex];
            attribute.bonus = (attribute.bonus ?? 0) + 1;
        });
    }

    private static getTwoDistinctRandomNumbers(max: number): number[] {
        const first = this.generateRandomNumber(max);
        let second;
        do {
            second = this.generateRandomNumber(max);
        } while (second === first);
        return [first, second];
    }

    private static applyUmanoideGenetics(newChar: CharacterSheetLUR): void {
        const genes = this.generateGenes();
        const statUpdates: string[] = [];
        const geneUpdates: string[] = [];

        const humanoidGenetic = this.geneticDefaultData.find(
            (g) => g.code === GeneticType.Umanoide
        );
        const abilities = humanoidGenetic?.abilities ?? []; // access abilities directly and ensure it's an array

        genes.forEach((gene) =>
            this.processGeneLevel(newChar, gene, geneUpdates, statUpdates, abilities)
        );
        newChar.genetic.genes = genes;

    }

    private static generateGenes(): string[] {
        return Array.from({ length: 3 }, () =>
            this.getKeyByValue(geneticTraceMapping, this.generateRandomNumber(6))
        ).filter((gene): gene is string => gene !== undefined);
    }
    private static distinctRandomStat(statsList:string[], statUpdates:string[], ): StatsType {
        let randomStat = this.getRandomElement(statsList);

        while (statUpdates.includes(randomStat)) {
            this.getRandomElement(statsList);
        }

        statUpdates.push(randomStat);

        return StatsType[randomStat as keyof typeof StatsType];
    }

    private static processGeneLevel(newChar: CharacterSheetLUR, gene: string, geneUpdates: string[], statUpdates: string[], abilities: Ability[]): void {
        geneUpdates.push(gene);
        const level = geneUpdates.filter((g) => g === gene).length;

        switch (gene) {
            case HumanGenesType.CROMOSOMA_E:{
                const randomStat = this.distinctRandomStat([StatsType.AGILITY, StatsType.MAGIC, StatsType.PERCEPTION], statUpdates);
                this.applyGeneE(newChar, level, randomStat, abilities);
                break;
            }
            case HumanGenesType.CROMOSOMA_N:{
                const randomStat = this.distinctRandomStat([StatsType.COURAGE, StatsType.STRENGTH, StatsType.MANUALITY], statUpdates);
                this.applyGeneN(newChar, level, randomStat, abilities);
                break;}
            case HumanGenesType.CROMOSOMA_U:{
                const randomStat = this.distinctRandomStat([
                    StatsType.AGILITY, StatsType.COURAGE, StatsType.STRENGTH, StatsType.INTELLIGENCE,
                    StatsType.MAGIC, StatsType.MANUALITY, StatsType.PERCEPTION], statUpdates);
                this.applyGeneU(newChar, level, randomStat, abilities);
                break;}
        }
    }

    private static applyGeneE( newChar: CharacterSheetLUR, level: number,  randomStat: StatsType,  abilities: Ability[] ): void {
        this.updateAttributes(newChar.attributes, randomStat, 1);
        if (level === 1) {
            this.addLifeMana(newChar, 2, 1);
            newChar.genetic.abilities.push(
                abilities.find((a) => a.code === 'MANA_SELVAGGIO') as Ability
            );
        } else if (level === 2) {
            this.addLifeMana(newChar, 2, 1);
            newChar.genetic.abilities.push(
                abilities.find((a) => a.code === 'IMMUNITA') as Ability
            );
        } else if (level === 3) {
            this.updateAttributes(newChar.attributes, StatsType.STRENGTH, -1);
            this.addLifeMana(newChar, 2, 1);
            newChar.genetic.abilities.push(
                abilities.find((a) => a.code === 'SANGUE_GIOVANE') as Ability
            );
        }
    }

    private static applyGeneN(newChar: CharacterSheetLUR, level: number, randomStat: StatsType, abilities: Ability[]): void {
        this.updateAttributes(newChar.attributes, randomStat, 1);
        if (level === 1) {
            this.addLifeMana(newChar, 4, 0);
            newChar.genetic.abilities.push(
                abilities.find((a) => a.code === 'TEMPRATO') as Ability
            );
        } else if (level === 2) {
            this.updateAttributes(newChar.attributes, StatsType.MAGIC, -1);
            this.addLifeMana(newChar, 4, 0);
            newChar.genetic.abilities.push(
                abilities.find((a) => a.code === 'STIMARE') as Ability
            );
        } else if (level === 3) {
            this.updateAttributes(newChar.attributes, StatsType.AGILITY, -1);
            this.addLifeMana(newChar, 4, 0);
            newChar.genetic.abilities.push(
                abilities.find((a) => a.code === 'COMBATTENTE_GRANITICO') as Ability
            );
        }
    }

    private static applyGeneU(newChar: CharacterSheetLUR,level: number, randomStat: StatsType, abilities: Ability[] ): void {
        if (level === 1) {
            this.addLifeMana(newChar, 4, 1);
        } else if (level === 2) {
            this.updateAttributes(newChar.attributes, StatsType.SOCIALITY, 1);
            newChar.genetic.abilities.push(
                abilities.find((a) => a.code === 'SUPERARE_LIMITE') as Ability
            );
            this.addLifeMana(newChar, 2, 0);
        } else if (level === 3) {
            this.updateAttributes(newChar.attributes, randomStat, 1);
            newChar.genetic.abilities.push(
                abilities.find((a) => a.code === 'FORTUNA') as Ability
            );
            this.addLifeMana(newChar, 2, 0);
        }
    }

    private static addLifeMana(
        newChar: CharacterSheetLUR,
        life: number,
        mana: number
    ): void {
        newChar.life = (newChar.life ?? 0) + life;
        newChar.mana = (newChar.mana ?? 0) + mana;
    }

    public static initCharacter(
        sessionId: string | undefined
    ): CharacterSheetLUR {
        return {
            name: '',
            genetic: {} as Genetic,
            excellence: '',
            role: {} as Role,
            attributes: this.attributeKeys.map((attr) => ({
                description: attr.description,
                code: attr.code,
                value: undefined,
                bonus: undefined,
            })),
            mana: undefined,
            life: undefined,
            armor: undefined,
            inventory: '',
            scrap: undefined,
            point_adventure: undefined,
            background: '',
            sessionId: sessionId,
        };
    }

    public static async generateRandomCharacter(
        newChar: CharacterSheetLUR,
        randomNameService: RandomNameService
    ): Promise<CharacterSheetLUR> {
        newChar.name = await this.getRandomName(randomNameService);
        const idGenetic = this.getKeyByValue(mapIdGenetic, this.generateRandomNumber(6));
        newChar.genetic = structuredClone(this.geneticDefaultData.find((g) => g.code === idGenetic) || ({} as Genetic));
        newChar.genetic.abilities = [];

        this.fillGeneticValues(newChar, newChar.genetic);

        
        return newChar;
    }

    private static getKeyByValue = (
        dictionary: { [key: string]: any },
        input: number
    ): number | string | undefined => {
        return Object.entries(dictionary).find(([, value]) =>
            Array.isArray(value) ? value.includes(input) : value === input
        )?.[0] as number | string | undefined;
    };
}

export enum GeneticType {
    Bios = 'BIOS',
    Nomade = 'NOMADE',
    Umanoide = 'UMANOIDE',
}

export enum HumanGenesType {
    CROMOSOMA_E = 'E',
    CROMOSOMA_N = 'N',
    CROMOSOMA_U = 'U',
}

export enum StatsType {
    AGILITY = 'AGILITY',
    COURAGE = 'COURAGE',
    STRENGTH = 'STRENGTH',
    INTELLIGENCE = 'INTELLIGENCE',
    MAGIC = 'MAGIC',
    MANUALITY = 'MANUALITY',
    PERCEPTION = 'PERCEPTION',
    SOCIALITY = 'SOCIALITY',
}
