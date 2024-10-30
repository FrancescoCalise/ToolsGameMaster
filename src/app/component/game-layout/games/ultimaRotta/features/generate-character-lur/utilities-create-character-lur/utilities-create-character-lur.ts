import { RandomNameService } from '../../../../../../../services/randomNameService';
import { Ability, Attribute, CharacterSheetLUR, Genetic, Role, Trait, } from '../charachter-sheet-lur';
import { attributeKeys, genetic, geneticTraceMapping, mapIdGenetic, roles, roleTraceMapping, traits, traitTraceMapping, } from '../data-sheet-lur';

export class UtilitiesCreateCharacterLur {
    static readonly rolesDefaultData = roles;
    static readonly geneticDefaultData = genetic;
    static readonly attributeKeys = attributeKeys;
    static readonly traitsDefaultData = traits;

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

    private static updateAttributes(attributes: any[], code: StatsType, incrementBonus: number, incremetValue: number = 0): void {
        const attribute = attributes.find((attr) => attr.code === code);
        if (attribute) {
            attribute.bonus = (attribute.bonus ?? 0) + incrementBonus;
            attribute.value = incremetValue;
        }
    }

    private static fillGeneticValues(newChar: CharacterSheetLUR, genetic: Genetic) {
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
            case GeneticType.Bios:
                this.applyBiosGenetics(newChar);
                break;
            case GeneticType.Nomade:
                this.applyNomadeGenetics(newChar);
                break;
            case GeneticType.Umanoide:
                this.applyUmanoideGenetics(newChar);
                break;
        }
    }

    static applyBiosGenetics(newChar: CharacterSheetLUR) {
        let abilities = this.geneticDefaultData.find((r) => r.code === GeneticType.Bios)?.abilities as Ability[];
        newChar.genetic.abilities = structuredClone(abilities);

        newChar.inventory =  newChar.inventory + "Arma 1 - Equpaggiamento 1 \n";
    }

    private static applyNomadeGenetics(newChar: CharacterSheetLUR): void {
        const randomStats = this.getTwoDistinctRandomNumbers(8);
        randomStats.forEach((statIndex) => {
            const attribute = newChar.attributes?.[statIndex -1];
            attribute.bonus = (attribute.bonus ?? 0) + 1;
        });

        let nomadeAbilities = this.geneticDefaultData.find((r) => r.code === GeneticType.Nomade)?.abilities as Ability[];
        newChar.genetic.abilities = structuredClone(nomadeAbilities);

        newChar.inventory =  newChar.inventory + "Abiti - Arma 1";
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

        newChar.inventory =  newChar.inventory + "Abiti - Sostentamento \n";
    }

    private static generateGenes(): string[] {
        return Array.from({ length: 3 }, () =>
            this.getKeyByValue(geneticTraceMapping, this.generateRandomNumber(6))
        ).filter((gene): gene is string => gene !== undefined);
    }

    private static distinctRandomStat(statsList: string[], statUpdates: string[]): StatsType {
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
            case HumanGenesType.CROMOSOMA_E: {
                const randomStat = this.distinctRandomStat([StatsType.AGILITY, StatsType.MAGIC, StatsType.PERCEPTION], statUpdates);
                this.applyGeneE(newChar, level, randomStat, abilities);
                break;
            }
            case HumanGenesType.CROMOSOMA_N: {
                const randomStat = this.distinctRandomStat([StatsType.COURAGE, StatsType.STRENGTH, StatsType.MANUALITY], statUpdates);
                this.applyGeneN(newChar, level, randomStat, abilities);
                break;
            }
            case HumanGenesType.CROMOSOMA_U: {
                const randomStat = this.distinctRandomStat([
                    StatsType.AGILITY, StatsType.COURAGE, StatsType.STRENGTH, StatsType.INTELLIGENCE,
                    StatsType.MAGIC, StatsType.MANUALITY, StatsType.PERCEPTION], statUpdates);
                this.applyGeneU(newChar, level, randomStat, abilities);
                break;
            }
        }
    }

    private static applyGeneE(newChar: CharacterSheetLUR, level: number, randomStat: StatsType, abilities: Ability[]): void {
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

    private static applyGeneU(newChar: CharacterSheetLUR, level: number, randomStat: StatsType, abilities: Ability[]): void {
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
                value: 1,
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
            traits: [] as Trait[]
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

        // Fill genetic values
        this.fillGeneticValues(newChar, newChar.genetic);
        //Fill eccellence
        let randomStr = this.distinctRandomStat([StatsType.AGILITY, StatsType.COURAGE, StatsType.STRENGTH, StatsType.INTELLIGENCE, StatsType.MAGIC, StatsType.MANUALITY, StatsType.PERCEPTION, StatsType.SOCIALITY], []);
        let attribute = newChar.attributes.find((attr) => attr.code === randomStr);
        newChar.excellence = attribute?.description || '';

        // Fill background
        let traits = this.applyTraits(newChar);
        newChar.traits = traits;

        // Fill role
        let randomRole = this.getKeyByValue(roleTraceMapping, this.generateRandomNumber(6));
        let roleDefaultData = this.rolesDefaultData.find((r) => r.code === randomRole);
        let roleToSet = structuredClone(roleDefaultData) as Role;

        let haveTraitsLeaderOrSoldato = traits.find(t => t.code == TraitsType.RUOLO_FACILITATO_LEADER_O_SOLDATO) ? true : false;
        let haveTraitsArcanistaOrDiscepoloOscuro = traits.find(t => t.code == TraitsType.RUOLO_FACILITATO_ARCANISTA_O_DISCEPOLO_OSCURO) ? true : false;
        let haveTraitsCanagliaOrRicognitore = traits.find(t => t.code == TraitsType.RUOLO_FACILITATO_CANAGLIA_O_RICOGNITORE) ? true : false;
        let admissionTestPassed = false;

        if ((roleToSet.code === RoleType.LEADER || roleToSet.code === RoleType.SOLDATO) && haveTraitsLeaderOrSoldato) {
            admissionTestPassed = true;
        }
        if ((roleToSet.code === RoleType.ARCANISTA || roleToSet.code === RoleType.DISCEPOLO_OSCURO) && haveTraitsArcanistaOrDiscepoloOscuro) {
            admissionTestPassed = true;
        }
        if ((roleToSet.code === RoleType.CANAGLIA || roleToSet.code === RoleType.RICOGNITORE) && haveTraitsCanagliaOrRicognitore) {
            admissionTestPassed = true;
        }

        if (!admissionTestPassed) {
            this.applyBonusRole(newChar, roleToSet);
            let attribtes = newChar.attributes;
            let attributeToTest = attribtes.find((attr) =>
                roleToSet.code === RoleType.LEADER && attr.code === StatsType.INTELLIGENCE ||
                roleToSet.code === RoleType.SOLDATO && attr.code === StatsType.STRENGTH ||
                roleToSet.code === RoleType.ARCANISTA && attr.code === StatsType.SOCIALITY ||
                roleToSet.code === RoleType.DISCEPOLO_OSCURO && attr.code === StatsType.MAGIC ||
                roleToSet.code === RoleType.CANAGLIA && attr.code === StatsType.MANUALITY ||
                roleToSet.code === RoleType.RICOGNITORE && attr.code === StatsType.PERCEPTION
            ) as unknown as Attribute;
            let valueToTest = attributeToTest.value ?? 0;
            let bonusToTest = attributeToTest.bonus ?? 0;

            let randomTest = this.getMaxRandomValue(10, valueToTest, bonusToTest);

            if (randomTest > 5) {
                admissionTestPassed = true;
            } else {
                newChar.background = `${newChar.background} - Non ha superato il test di ammissione per ${roleToSet.description} \n`;
                let inventory = newChar.inventory ? newChar.inventory.split('-') : [];
                let indexToRemove = this.generateRandomNumber(inventory.length) - 1;
                inventory = inventory.filter((i, index) => index !== indexToRemove);
                newChar.inventory = inventory.join('-');

                let newRole = this.getKeyByValue(roleTraceMapping, this.generateRandomNumber(6));
                while (newRole === randomRole) {
                    newRole = this.getKeyByValue(roleTraceMapping, this.generateRandomNumber(6));
                }
                let roleDefaultData = this.rolesDefaultData.find((r) => r.code === newRole) as Role;
                roleToSet = structuredClone(roleDefaultData) as Role;
            }
        }


        let persistedRoleAbility = newChar.role?.abilities ? structuredClone(newChar.role?.abilities as Ability[]): [];
        newChar.role = roleToSet;
        newChar.role.abilities = persistedRoleAbility;

        

        let skillAlreadLearned = newChar.role.abilities ? newChar.role.abilities.map((a) => a.code) : [];
        let randomIdAbility = this.generateRandomNumber(10) -1;
        let ability = roleDefaultData?.abilities[randomIdAbility] as Ability;
        if (ability) {
            while (skillAlreadLearned.includes(ability.code)) {
                randomIdAbility = this.generateRandomNumber(10);
                ability = this.rolesDefaultData.find((r) => r.code === roleToSet.code)?.abilities[randomIdAbility] as Ability;
            }
            newChar.role.abilities.push(ability);
        }

        if (admissionTestPassed) {
            let testOnRoadPassed = false;

            let attributeToTest = newChar.attributes.find((attr) =>
                roleToSet.code === RoleType.LEADER && attr.code === StatsType.INTELLIGENCE ||
                roleToSet.code === RoleType.SOLDATO && attr.code === StatsType.STRENGTH ||
                roleToSet.code === RoleType.ARCANISTA && attr.code === StatsType.SOCIALITY ||
                roleToSet.code === RoleType.DISCEPOLO_OSCURO && attr.code === StatsType.MAGIC ||
                roleToSet.code === RoleType.CANAGLIA && attr.code === StatsType.MANUALITY ||
                roleToSet.code === RoleType.RICOGNITORE && attr.code === StatsType.PERCEPTION
            ) as unknown as Attribute;

            let valueToTest = attributeToTest.value ?? 0;
            let bonusToTest = attributeToTest.bonus ?? 0;

            let randomTest = this.getMaxRandomValue(10, valueToTest, bonusToTest);
            if (randomTest > 7) {
                testOnRoadPassed = true;
            }

            if (testOnRoadPassed) {
                let randomAbility = this.generateRandomNumber(10);
                let ability = this.rolesDefaultData.find((r) => r.code === roleToSet.code)?.abilities[randomAbility] as Ability;
                if (ability) {
                    while (skillAlreadLearned.includes(ability.code)) {
                        randomAbility = this.generateRandomNumber(10);
                        ability = this.rolesDefaultData.find((r) => r.code === roleToSet.code)?.abilities[randomAbility] as Ability;
                    }
                    newChar.role.abilities.push(ability);
                }
                newChar.background = `${newChar.background} - Hai superato la prova sul campo \n`;
            }
        }
        return newChar;
    }

    static applyBonusRole(newChar: CharacterSheetLUR, roleToSet: Role) {

        switch (roleToSet.code) {
            case RoleType.LEADER: {
                this.addLifeMana(newChar, 1, 2);
                this.updateAttributes(newChar.attributes, StatsType.COURAGE, 0, 2);
                this.updateAttributes(newChar.attributes, StatsType.INTELLIGENCE, 0, 2);
                this.updateAttributes(newChar.attributes, StatsType.SOCIALITY, 0, 2);
                newChar.inventory = newChar.inventory + "Arma 2 - Equpaggiamento 1 - Equipaggiamento 2 \n";
                break;
            }
            case RoleType.SOLDATO: {
                this.addLifeMana(newChar, 3, 0);
                this.updateAttributes(newChar.attributes, StatsType.AGILITY, 0, 2);
                this.updateAttributes(newChar.attributes, StatsType.COURAGE, 0, 2);
                this.updateAttributes(newChar.attributes, StatsType.STRENGTH, 0, 2);
                newChar.inventory = newChar.inventory + "Arma 1 - Arma 2 - Sostentamento \n";
                break;
            }
            case RoleType.ARCANISTA: {
                this.addLifeMana(newChar, 2, 1);
                this.updateAttributes(newChar.attributes, StatsType.COURAGE, 0, 2);
                this.updateAttributes(newChar.attributes, StatsType.INTELLIGENCE, 0, 2);
                this.updateAttributes(newChar.attributes, StatsType.MAGIC, 0, 2);
                newChar.inventory = newChar.inventory + "Equpaggiamento 2 - Rottami - Sostentamento \n";
                break;
            }
            case RoleType.DISCEPOLO_OSCURO: {
                this.addLifeMana(newChar, 0, 3);
                this.updateAttributes(newChar.attributes, StatsType.INTELLIGENCE, 0, 2);
                this.updateAttributes(newChar.attributes, StatsType.MAGIC, 0, 2);
                this.updateAttributes(newChar.attributes, StatsType.SOCIALITY, 0, 2);
                newChar.inventory = newChar.inventory + "Arma 1 - Equipaggiamento 2 - Sostentamento \n";
                break;
            }
            case RoleType.CANAGLIA: {
                this.addLifeMana(newChar, 1, 2);
                this.updateAttributes(newChar.attributes, StatsType.AGILITY, 0, 2);
                this.updateAttributes(newChar.attributes, StatsType.MANUALITY, 0, 2);
                this.updateAttributes(newChar.attributes, StatsType.PERCEPTION, 0, 2);
                newChar.inventory = newChar.inventory + "Arma 1 - Equpaggiamento 1 - Rottami \n";
                break;
            }
            case RoleType.RICOGNITORE: {
                this.addLifeMana(newChar, 2, 1);
                this.updateAttributes(newChar.attributes, StatsType.AGILITY, 0, 2);
                this.updateAttributes(newChar.attributes, StatsType.COURAGE, 0, 2);
                this.updateAttributes(newChar.attributes, StatsType.PERCEPTION, 0, 2);
                newChar.inventory = newChar.inventory + "Arma 2 - Equpaggiamento 1 - Equpaggiamento 2 \n";
                break;
            }

        }
    }



    private static generateTraits(maxInt: number): Trait {
        let randomInt = this.generateRandomNumber(maxInt);
        let getCodeFromMapping = this.getKeyByValue(traitTraceMapping, randomInt);
        let trait = this.traitsDefaultData.find((t) => t.code === getCodeFromMapping);
        return trait as Trait;
    }

    private static applyTraits(newChar: CharacterSheetLUR): Trait[] {
        let trait = this.generateTraits(20);
        let traitGenerated: Trait[] = [];
        traitGenerated.push(trait);

        this.switchTraits(newChar, trait, traitGenerated);

        return traitGenerated;
    }

    private static switchTraits(newChar: CharacterSheetLUR, trait: Trait, traitGenerated: Trait[]): void {
        newChar.background = trait.description;
        switch (trait.code) {
            case TraitsType.CICATRICE: {
                // Logic for CICATRICE
                this.addLifeMana(newChar, -1, 0);
                break;
            }
            case TraitsType.MALATO_DIFETTOSO: {
                let randomIndex = this.generateRandomNumber(newChar.genetic.abilities.length);
                let isBios = newChar.genetic.code === GeneticType.Bios;

                while (isBios && newChar.genetic.abilities[randomIndex].code === 'MALATO_DIFETTOSO') {
                    randomIndex = this.generateRandomNumber(newChar.genetic.abilities.length);
                }
                let codeToDelete = newChar.genetic.abilities[randomIndex].code;
                newChar.genetic.abilities = newChar.genetic.abilities.filter((a) => a.code != codeToDelete);

                let currentExcellence = newChar.excellence?.split('-') as string[];
                let randomStr = this.distinctRandomStat([StatsType.AGILITY, StatsType.COURAGE, StatsType.STRENGTH, StatsType.INTELLIGENCE, StatsType.MAGIC, StatsType.MANUALITY, StatsType.PERCEPTION, StatsType.SOCIALITY], currentExcellence);
                newChar.excellence = currentExcellence.join('-') + '-' + newChar.attributes.find((attr) => attr.code === randomStr)?.description;
                break;
            }
            case TraitsType.AGIATO: {
                newChar.scrap = newChar.scrap ? newChar.scrap + 50 : 50;
                break;
            }
            case TraitsType.SPIETATO: {
                this.addLifeMana(newChar, 0, -1);
                break;
            }
            case TraitsType.FRONT_MAN: {
                const attribute = newChar.attributes.find((attr) => attr.code === StatsType.SOCIALITY);
                if (attribute) {
                    attribute.bonus = (attribute.bonus ?? 0) + 1;
                }
                break;
            }
            case TraitsType.ROTTMATORE: {
                // Logic for ROTTAMATORE
                const attribute = newChar.attributes.find((attr) => attr.code === StatsType.MANUALITY);
                if (attribute) {
                    attribute.bonus = (attribute.bonus ?? 0) + 1;
                }
                newChar.inventory = newChar.inventory + "Kit da meccanico \n";
                let scrap = this.getMaxRandomValue(20, 3, 0) + 10;
                newChar.scrap = newChar.scrap ? newChar.scrap + scrap : scrap;
                break;
            }
            case TraitsType.SEI_PROPRIO_GROSSO: {
                // Logic for SEI_PROPRIO_GROSSO
                this.addLifeMana(newChar, 2, 0);
                break;
            }
            case TraitsType.HAI_UNA_SCINTILLA: {
                // Logic for HAI_UNA_SCINTILLA
                this.addLifeMana(newChar, 0, 1);
                break;
            }
            case TraitsType.TALENTO_NATURALE: {
                // Logic for TALENTO_NATURALE
                let roleCode = this.getKeyByValue(geneticTraceMapping, this.generateRandomNumber(4));
                let roleRandom = this.rolesDefaultData.find((r) => r.code === roleCode) as Role;

                let abilityRole = roleRandom.abilities as Ability[];
                let abilityRandom = this.generateRandomNumber(9);
                let ability = abilityRole[abilityRandom];
                newChar.role?.abilities.push(ability);

                break;
            }
            case TraitsType.GENETICA_MISTA: {
                // Logic for GENETICA_MISTA
                const attribute = newChar.attributes.find((attr) => attr.code === StatsType.SOCIALITY);
                if (attribute) {
                    attribute.bonus = (attribute.bonus ?? 0) - 1;
                }
                let humanAbility = this.rolesDefaultData.find((r) => r.code === GeneticType.Umanoide)?.abilities as Ability[];
                let abilityRandom = this.generateRandomNumber(humanAbility.length);
                while (newChar.role?.abilities.includes(humanAbility[abilityRandom])) {
                    abilityRandom = this.generateRandomNumber(humanAbility.length);
                }
                newChar.role?.abilities.push(humanAbility[abilityRandom]);
                break;
            }
            case TraitsType.TIRA_DUE_VOLTE: {
                for (let i = 0; i < 2; i++) {
                    let newTrait = this.generateTraits(19);
                    while (traitGenerated.includes(trait)) {
                        newTrait = this.generateTraits(19);
                    }
                    traitGenerated.push(newTrait);
                    this.switchTraits(newChar, newTrait, traitGenerated);
                }
                break;
            }
            case TraitsType.DUE_VITE:
            case TraitsType.ARMA_EXTRA_1:
            case TraitsType.ARMA_EXTRA_2:
            case TraitsType.RUOLO_FACILITATO_ARCANISTA_O_DISCEPOLO_OSCURO:
            case TraitsType.RUOLO_FACILITATO_CANAGLIA_O_RICOGNITORE:
            case TraitsType.RUOLO_FACILITATO_LEADER_O_SOLDATO:
            case TraitsType.VENDICATIVO:
            case TraitsType.SANGUINARIO:
            case TraitsType.INCUBI: {
                break;
            }

        }
    }

    private static getMaxRandomValue(max: number, times: number, bonus: number): number {
        let highestValue = 0;
        if(times === 0) {
            times = 1;
        }

        for (let i = 0; i < times; i++) {
            const randomValue = Math.floor(Math.random() * max) + 1 + bonus;
            if (randomValue > highestValue) {
                highestValue = randomValue;
            }
        }

        return highestValue;
    }

    private static getKeyByValue = (dictionary: { [key: string]: any },input: number ): number | string | undefined => {
        let d = Object.entries(dictionary).find(([, value]) =>
            Array.isArray(value) ? value.includes(input) : value === input
        )?.[0] as number | string | undefined;

        return d;
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

export enum TraitsType {
    CICATRICE = 'CICATRICE',
    INCUBI = 'INCUBI',
    MALATO_DIFETTOSO = 'MALATO_DIFETTOSO',
    SANGUINARIO = 'SANGUINARIO',
    VENDICATIVO = 'VENDICATIVO',
    RUOLO_FACILITATO_LEADER_O_SOLDATO = 'RUOLO_FACILITATO_LEADER_O_SOLDATO',
    RUOLO_FACILITATO_CANAGLIA_O_RICOGNITORE = 'RUOLO_FACILITATO_CANAGLIA_O_RICOGNITORE',
    RUOLO_FACILITATO_ARCANISTA_O_DISCEPOLO_OSCURO = 'RUOLO_FACILITATO_ARCANISTA_O_DISCEPOLO_OSCURO',
    AGIATO = 'AGIATO',
    SPIETATO = 'SPIETATO',
    FRONT_MAN = 'FRONT_MAN',
    ROTTMATORE = 'ROTTMATORE',
    SEI_PROPRIO_GROSSO = 'SEI_PROPRIO_GROSSO',
    HAI_UNA_SCINTILLA = 'HAI_UNA_SCINTILLA',
    TALENTO_NATURALE = 'TALENTO_NATURALE',
    ARMA_EXTRA_1 = 'ARMA_EXTRA_1',
    ARMA_EXTRA_2 = 'ARMA_EXTRA_2',
    DUE_VITE = 'DUE_VITE',
    GENETICA_MISTA = 'GENETICA_MISTA',
    TIRA_DUE_VOLTE = 'TIRA_DUE_VOLTE'
}

export enum RoleType {
    LEADER = 'LEADER',
    SOLDATO = 'SOLDATO',
    ARCANISTA = 'ARCANISTA',
    DISCEPOLO_OSCURO = 'DISCEPOLO_OSCURO',
    CANAGLIA = 'CANAGLIA',
    RICOGNITORE = 'RICOGNITORE'
}