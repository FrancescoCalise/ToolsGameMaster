import { firstValueFrom } from 'rxjs';
import { RandomNameService } from '../../../../../../../services/randomNameService';
import { Ability, Attribute, CharacterSheetLUR, CharacterSheetLURTemplate, Genetic, Role, Trait, } from '../charachter-sheet-lur';
import { attributeKeys, genetic, geneticTraceMapping, mapIdGenetic, roles, roleTraceMapping, traits, traitTraceMapping, armorDetails, codeItemTableLUR, CLOTHES, WEAPON_1, WEAPON_2, EQUIP_1, EQUIP_2, SUSTENANCE, ELETTROLITA } from '../data-sheet-lur';
import { FieldResizeConfig } from '../../../../../../../services/pdf.service';
import { TranslationMessageService } from '../../../../../../../services/translation-message-service';

export class UtilitiesCreateCharacterLur {


    static readonly rolesDefaultData = roles;
    static readonly geneticDefaultData = genetic;
    static readonly attributeKeys = attributeKeys;
    static readonly traitsDefaultData = traits;
    static readonly armorDetails = armorDetails;
    static readonly codeItemTableLUR = codeItemTableLUR;

    static readonly items = {
        "CLOTHES": CLOTHES,
        "WEAPON_1": WEAPON_1,
        "WEAPON_2": WEAPON_2,
        "EQUIP_1": EQUIP_1,
        "EQUIP_2": EQUIP_2,
        "SUSTENANCE": SUSTENANCE,
        "ELETTROLITA": ELETTROLITA
    };

    static readonly pathTemplateFIle = 'assets/pdfFiles/{0}/ultima-rotta-template.pdf';

    constructor() { }

    private static generateRandomNumber(max: number): number {
        return Math.floor(Math.random() * max) + 1;
    }

    private static getRandomElement<T>(elements: T[]): T {
        return elements[Math.floor(Math.random() * elements.length)];
    }

    private static async getRandomName(randomNameService: RandomNameService): Promise<string> {
        try {
            let name = await firstValueFrom(randomNameService.getRandomName());
            return name;
        } catch (error) {
            return '';
        }
    }


    private static updateAttributes(attributes: any[], code: StatsType, incrementBonus: number, incremetValue: number = 1): void {
        const attribute = attributes.find((attr) => attr.code === code);
        if (attribute) {
            attribute.bonus = (attribute.bonus ?? 0) + incrementBonus;
            attribute.value = incremetValue;
        }
    }

    private static fillGeneticValues(newPg: CharacterSheetLUR, genetic: Genetic, translate: TranslationMessageService): void {
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
            newPg.life = applyGenetics.life;
            newPg.mana = applyGenetics.mana;
            newPg.armor = applyGenetics.armor;
        }

        switch (genetic.code) {
            case GeneticType.Bios:
                this.applyBiosGenetics(newPg, translate);
                break;
            case GeneticType.Nomade:
                this.applyNomadeGenetics(newPg, translate);
                break;
            case GeneticType.Umanoide:
                this.applyUmanoideGenetics(newPg, translate);
                break;
        }
    }

    static applyBiosGenetics(newPg: CharacterSheetLUR, translate: TranslationMessageService) {
        let abilities = this.geneticDefaultData.find((r) => r.code === GeneticType.Bios)?.abilities as Ability[];
        newPg.genetic.abilities = structuredClone(abilities);

        this.updateInventory(["WEAPON_1", "EQUIP_1"], newPg, translate);
    }

    private static applyNomadeGenetics(newPg: CharacterSheetLUR, translate: TranslationMessageService): void {
        const randomStats = this.getTwoDistinctRandomNumbers(8);
        randomStats.forEach((statIndex) => {
            const attribute = newPg.attributes?.[statIndex - 1];
            attribute.bonus = (attribute.bonus ?? 0) + 1;
        });

        let nomadeAbilities = this.geneticDefaultData.find((r) => r.code === GeneticType.Nomade)?.abilities as Ability[];
        newPg.genetic.abilities = structuredClone(nomadeAbilities);
        this.updateInventory(["CLOTHES", "WEAPON_1"], newPg, translate);
    }

    private static getTwoDistinctRandomNumbers(max: number): number[] {
        const first = this.generateRandomNumber(max);
        const possibleSeconds = Array.from({ length: max }, (_, i) => i + 1).filter(n => n !== first);
        const second = possibleSeconds[this.generateRandomNumber(possibleSeconds.length) - 1];

        return [first, second];
    }

    private static applyUmanoideGenetics(newPg: CharacterSheetLUR, translate: TranslationMessageService): void {
        const genes = this.generateGenes();
        const statUpdates: string[] = [];
        const geneUpdates: string[] = [];

        const humanoidGenetic = this.geneticDefaultData.find(
            (g) => g.code === GeneticType.Umanoide
        );
        const abilities = humanoidGenetic?.abilities ?? []; // access abilities directly and ensure it's an array

        genes.forEach((gene) =>
            this.processGeneLevel(newPg, gene, geneUpdates, statUpdates, abilities)
        );
        newPg.genetic.genes = genes;
        this.updateInventory(["CLOTHES", "SUSTENANCE"], newPg, translate);
    }

    private static generateGenes(): string[] {
        return Array.from({ length: 3 }, () =>
            this.getKeyByValue(geneticTraceMapping, this.generateRandomNumber(6))
        ).filter((gene): gene is string => gene !== undefined);
    }

    private static distinctRandomStat(statsList: string[], statUpdates: string[]): StatsType {
        // Filtra `statsList` per escludere gli elementi già presenti in `statUpdates`
        const availableStats = statsList.filter((stat) => !statUpdates.includes(stat));
        const randomStat = this.getRandomElement(availableStats);
        statUpdates.push(randomStat);
        return StatsType[randomStat as keyof typeof StatsType];
    }

    private static processGeneLevel(newPg: CharacterSheetLUR, gene: string, geneUpdates: string[], statUpdates: string[], abilities: Ability[]): void {
        geneUpdates.push(gene);
        const level = geneUpdates.filter((g) => g === gene).length;

        switch (gene) {
            case HumanGenesType.CROMOSOMA_E: {
                const randomStat = this.distinctRandomStat([StatsType.AGILITY, StatsType.MAGIC, StatsType.PERCEPTION], statUpdates);
                this.applyGeneE(newPg, level, randomStat, abilities);
                break;
            }
            case HumanGenesType.CROMOSOMA_N: {
                const randomStat = this.distinctRandomStat([StatsType.COURAGE, StatsType.STRENGTH, StatsType.MANUALITY], statUpdates);
                this.applyGeneN(newPg, level, randomStat, abilities);
                break;
            }
            case HumanGenesType.CROMOSOMA_U: {
                const randomStat = this.distinctRandomStat([
                    StatsType.AGILITY, StatsType.COURAGE, StatsType.STRENGTH, StatsType.INTELLIGENCE,
                    StatsType.MAGIC, StatsType.MANUALITY, StatsType.PERCEPTION], statUpdates);
                this.applyGeneU(newPg, level, randomStat, abilities);
                break;
            }
        }
    }

    private static applyGeneE(newPg: CharacterSheetLUR, level: number, randomStat: StatsType, abilities: Ability[]): void {
        this.updateAttributes(newPg.attributes, randomStat, 1);
        if (level === 1) {
            this.addLifeMana(newPg, 2, 1);
            let ability = abilities.find((a) => a.code === 'MANA_SELVAGGIO') as Ability
            if (ability) {
                newPg.genetic.abilities.push(ability);
            }
        } else if (level === 2) {
            this.addLifeMana(newPg, 2, 1);
            let ability = abilities.find((a) => a.code === 'IMMUNITA') as Ability
            if (ability) {
                newPg.genetic.abilities.push(ability);
            }
        } else if (level === 3) {
            this.updateAttributes(newPg.attributes, StatsType.STRENGTH, -1);
            this.addLifeMana(newPg, 2, 1);
            let ability = abilities.find((a) => a.code === 'SANGUE_GIOVANE') as Ability
            if (ability) {
                newPg.genetic.abilities.push(ability);
            }
        }
    }

    private static applyGeneN(newPg: CharacterSheetLUR, level: number, randomStat: StatsType, abilities: Ability[]): void {
        this.updateAttributes(newPg.attributes, randomStat, 1);
        if (level === 1) {
            this.addLifeMana(newPg, 4, 0);
            let ability = abilities.find((a) => a.code === 'TEMPRATO') as Ability
            if (ability) {
                newPg.genetic.abilities.push(ability);
            }
        } else if (level === 2) {
            this.updateAttributes(newPg.attributes, StatsType.MAGIC, -1);
            this.addLifeMana(newPg, 4, 0);
            let ability = abilities.find((a) => a.code === 'STIMARE') as Ability
            if (ability) {
                newPg.genetic.abilities.push(ability);
            }
        } else if (level === 3) {
            this.updateAttributes(newPg.attributes, StatsType.AGILITY, -1);
            this.addLifeMana(newPg, 4, 0);
            let ability = abilities.find((a) => a.code === 'COMBATTENTE_GRANITICO') as Ability
            if (ability) {
                newPg.genetic.abilities.push(ability);
            }
        }
    }

    private static applyGeneU(newPg: CharacterSheetLUR, level: number, randomStat: StatsType, abilities: Ability[]): void {
        if (level === 1) {
            this.addLifeMana(newPg, 4, 1);
        } else if (level === 2) {
            this.updateAttributes(newPg.attributes, StatsType.SOCIALITY, 1);
            this.addLifeMana(newPg, 2, 0);

            let ability = abilities.find((a) => a.code === 'SUPERARE_LIMITE') as Ability
            if (ability) {
                newPg.genetic.abilities.push(ability);
            }
        } else if (level === 3) {
            this.updateAttributes(newPg.attributes, randomStat, 1);
            this.addLifeMana(newPg, 2, 0);

            let ability = abilities.find((a) => a.code === 'FORTUNA') as Ability
            if (ability) {
                newPg.genetic.abilities.push(ability);
            }
        }
    }

    private static addLifeMana(
        newPg: CharacterSheetLUR,
        life: number,
        mana: number
    ): void {
        newPg.life = (newPg.life ?? 0) + life;
        newPg.mana = (newPg.mana ?? 0) + mana;
    }

    public static async initCharacter(translationMessageService: TranslationMessageService): Promise<CharacterSheetLUR> {
        await this.initTranslationMessageService(translationMessageService)

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
            armorDetails: structuredClone(this.armorDetails),
            inventory: [] as string[],
            scrap: undefined,
            point_adventure: undefined,
            background: '',
            traits: [] as Trait[]
        };
    }

    private static async initTranslationMessageService(translationMessageService: TranslationMessageService): Promise<void> {
        let attributesWithDescription = this.attributeKeys;
        attributesWithDescription.forEach(async att => {
            if (att.code && !att.description) {
                att.description = await translationMessageService.translate('ULTIMA_ROTTA.ATTRIBUTES.' + att.code);
            }
            att.value = 1;
        });

        let armorDetail = this.armorDetails;
        armorDetail.forEach(async info => {
            if (info.code && !info.description) {
                info.description = await translationMessageService.translate('ULTIMA_ROTTA.ARMOR.' + info.code);
            }
        });
    }

    public static async initCharacterForTemplate(sessionId: string | undefined, translationMessageService: TranslationMessageService): Promise<CharacterSheetLURTemplate> {

        await this.initTranslationMessageService(translationMessageService);

        return {
            attributes: this.attributeKeys.map((attr) => ({
                description: attr.description,
                code: attr.code,
                value: 1,
                bonus: undefined,
            })),
            sessionId: sessionId,
            armorDetails: structuredClone(this.armorDetails),
        };
    }

    public static async generateRandomCharacter(randomNameService: RandomNameService, translate: TranslationMessageService): Promise<CharacterSheetLUR> {
        let newPg = await this.initCharacter(translate);
        newPg.name = await this.getRandomName(randomNameService);
        const idGenetic = this.getKeyByValue(mapIdGenetic, this.generateRandomNumber(6));
        newPg.genetic = structuredClone(this.geneticDefaultData.find((g) => g.code === idGenetic) || ({} as Genetic));
        newPg.genetic.abilities = [];

        try {
            // Fill genetic values
            this.fillGeneticValues(newPg, newPg.genetic, translate);

            //Fill eccellence
            let randomStr = this.distinctRandomStat([StatsType.AGILITY, StatsType.COURAGE, StatsType.STRENGTH, StatsType.INTELLIGENCE, StatsType.MAGIC, StatsType.MANUALITY, StatsType.PERCEPTION, StatsType.SOCIALITY], []);
            let attribute = newPg.attributes.find((attr) => attr.code === randomStr);
            newPg.excellence = attribute?.description || '';

            // Fill Traits
            this.applyTraits(newPg, translate);

            let labelTraits = await translate.translate('ULTIMA_ROTTA.SHEET.TRAITS');
            newPg.traits = await this.getTraitDescription(newPg.traits, translate);

            let tratisDescription = labelTraits + ' : ' + newPg.traits?.map((t) => t.description).join(' - ');

            newPg.background = newPg.background ?
                newPg.background + ' - ' + tratisDescription :
                tratisDescription;

            // Fill role
            let randomRole = this.getKeyByValue(roleTraceMapping, this.generateRandomNumber(6));
            const roleDefaultData = this.rolesDefaultData.find((r) => r.code === randomRole);
            let roleToSet = structuredClone(roleDefaultData) as Role;

            roleToSet.description = await translate.translate('ULTIMA_ROTTA.ROLE.' + roleToSet.code);

            let haveTraitsLeaderOrSoldato = newPg.traits?.find(t => t.code == TraitsType.RUOLO_FACILITATO_LEADER_O_SOLDATO) ? true : false;
            let haveTraitsArcanistaOrDiscepoloOscuro = newPg.traits?.find(t => t.code == TraitsType.RUOLO_FACILITATO_ARCANISTA_O_DISCEPOLO_OSCURO) ? true : false;
            let haveTraitsCanagliaOrRicognitore = newPg.traits?.find(t => t.code == TraitsType.RUOLO_FACILITATO_CANAGLIA_O_RICOGNITORE) ? true : false;
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
                let attribtes = newPg.attributes;
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
                    let r = roleToSet.description;

                    let testPassed = await translate.translate('ULTIMA_ROTTA.SHEET.TEST_PASSED');
                    let testAdmissionLabel = await translate.translate('ULTIMA_ROTTA.SHEET.TEST_ADMISSION', {
                        role: r,
                        result: testPassed
                    });
                    newPg.background = newPg.background ? `${newPg.background} - ${testAdmissionLabel} \n` : testAdmissionLabel;

                } else {
                    let testFailedLabel = await translate.translate('ULTIMA_ROTTA.SHEET.TEST_FAILED');
                    let testAdmissionLabel = await translate.translate('ULTIMA_ROTTA.SHEET.TEST_ADMISSION', {
                        role: roleToSet.description,
                        result: testFailedLabel
                    });

                    newPg.background = newPg.background ? `${newPg.background} - ${testAdmissionLabel} \n` : testAdmissionLabel;

                    const descriptionKitMeccanic = await translate.translate('ULTIMA_ROTTA.ITEMS.MECHANIC_KIT');

                    const itemCanBeRemoved = newPg.inventory?.filter(i => i !== descriptionKitMeccanic);
                    if (itemCanBeRemoved && itemCanBeRemoved.length > 0) {
                        const randomItem = itemCanBeRemoved[Math.floor(Math.random() * itemCanBeRemoved.length)];

                        newPg.inventory = newPg.inventory?.filter(i => i !== randomItem);
                    }


                    const availableRoles = Object.keys(roleTraceMapping).filter(
                        (role) => role !== randomRole
                    );
                    const newRole = this.getKeyByValue(roleTraceMapping, this.generateRandomNumber(availableRoles.length));

                    const newRoleDefaultData = structuredClone(this.rolesDefaultData.find((r) => r.code === newRole)) as Role;
                    roleToSet = newRoleDefaultData as Role;
                    roleToSet.description = await translate.translate('ULTIMA_ROTTA.ROLE.' + roleToSet.code);
                }
            }

            this.applyBonusRole(newPg, roleToSet, translate);
            let persistedRoleAbility = newPg.role?.abilities ? structuredClone(newPg.role?.abilities as Ability[]) : [];
            newPg.role = roleToSet;
            newPg.role.abilities = persistedRoleAbility;

            let skillAlreadLearned = newPg.role.abilities ? newPg.role.abilities.map((a) => a.code) : [];


            const availableAbilities = [...(roleDefaultData?.abilities as Ability[]).filter((a) => !skillAlreadLearned.includes(a.code))];

            // Se ci sono abilità disponibili, scegli una a caso
            if (availableAbilities.length > 0) {
                const randomIndex = this.generateRandomNumber(availableAbilities.length);
                let ability = availableAbilities[randomIndex - 1];
                newPg.role.abilities.push(ability);

            }

            if (admissionTestPassed) {
                let testOnRoadPassed = false;

                let attributeToTest = newPg.attributes.find((attr) =>
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
                    let availableAbilities = roleDefaultData?.abilities.filter((a) => !skillAlreadLearned.includes(a.code)) as Ability[];
                    if (availableAbilities) {
                        if (availableAbilities && availableAbilities.length > 0) {
                            const randomIndex = this.generateRandomNumber(availableAbilities.length);
                            let ability = availableAbilities[randomIndex - 1];
                            newPg.role.abilities.push(ability);
                        }
                    }
                    let labelTeastOnRoad = await translate.translate('ULTIMA_ROTTA.SHEET.TEST_ON_ROAD');
                    newPg.background = newPg.background ? `${newPg.background} - ${labelTeastOnRoad} \n` : labelTeastOnRoad;
                }
            }
            return newPg;
        } catch (error) {
            throw new Error(error as any);
        }
    }

    static async getTraitDescription(traits: Trait[] | undefined, translate: TranslationMessageService): Promise<Trait[]> {
        if (!traits) return [];

        const traitsWithDescription = await Promise.all(
            traits.map(async (t) => {
                t.code = t.code as string;
                t.description = await translate.translate('ULTIMA_ROTTA.TRAITS.' + t.code);
                return t;
            })
        );

        return traitsWithDescription;
    }

    static applyBonusRole(newPg: CharacterSheetLUR, roleToSet: Role, translate: TranslationMessageService) {

        switch (roleToSet.code) {
            case RoleType.LEADER: {
                this.addLifeMana(newPg, 1, 2);
                this.updateAttributes(newPg.attributes, StatsType.COURAGE, 0, 2);
                this.updateAttributes(newPg.attributes, StatsType.INTELLIGENCE, 0, 2);
                this.updateAttributes(newPg.attributes, StatsType.SOCIALITY, 0, 2);

                this.updateInventory(["WEAPON_2", "EQUIP_1", "EQUIP_2"], newPg, translate);

                break;
            }
            case RoleType.SOLDATO: {
                this.addLifeMana(newPg, 3, 0);
                this.updateAttributes(newPg.attributes, StatsType.AGILITY, 0, 2);
                this.updateAttributes(newPg.attributes, StatsType.COURAGE, 0, 2);
                this.updateAttributes(newPg.attributes, StatsType.STRENGTH, 0, 2);

                this.updateInventory(["WEAPON_1", "WEAPON_2", "SUSTENANCE"], newPg, translate);

                break;
            }
            case RoleType.ARCANISTA: {
                this.addLifeMana(newPg, 2, 1);
                this.updateAttributes(newPg.attributes, StatsType.COURAGE, 0, 2);
                this.updateAttributes(newPg.attributes, StatsType.INTELLIGENCE, 0, 2);
                this.updateAttributes(newPg.attributes, StatsType.MAGIC, 0, 2);
                this.updateInventory(["EQUIP_2", "SCRAPS", "SUSTENANCE"], newPg, translate);
                break;
            }
            case RoleType.DISCEPOLO_OSCURO: {
                this.addLifeMana(newPg, 0, 3);
                this.updateAttributes(newPg.attributes, StatsType.INTELLIGENCE, 0, 2);
                this.updateAttributes(newPg.attributes, StatsType.MAGIC, 0, 2);
                this.updateAttributes(newPg.attributes, StatsType.SOCIALITY, 0, 2);
                this.updateInventory(["WEAPON_1", "EQUIP_2", "SUSTENANCE"], newPg, translate);
                break;
            }
            case RoleType.CANAGLIA: {
                this.addLifeMana(newPg, 1, 2);
                this.updateAttributes(newPg.attributes, StatsType.AGILITY, 0, 2);
                this.updateAttributes(newPg.attributes, StatsType.MANUALITY, 0, 2);
                this.updateAttributes(newPg.attributes, StatsType.PERCEPTION, 0, 2);
                this.updateInventory(["WEAPON_1", "EQUIP_1", "SCRAPS"], newPg, translate);
                break;
            }
            case RoleType.RICOGNITORE: {
                this.addLifeMana(newPg, 2, 1);
                this.updateAttributes(newPg.attributes, StatsType.AGILITY, 0, 2);
                this.updateAttributes(newPg.attributes, StatsType.COURAGE, 0, 2);
                this.updateAttributes(newPg.attributes, StatsType.PERCEPTION, 0, 2);
                this.updateInventory(["WEAPON_2", "EQUIP_1", "EQUIP_2"], newPg, translate);
                break;
            }

        }
    }

     static async updateInventory(itemCodes: string[], currentPG: CharacterSheetLUR, translate: TranslationMessageService) {
        itemCodes.forEach(async (itemCode:string) => {
            if (itemCode === 'SCRAPS') {
                let diceResult = this.generateRandomNumber(8);
                let scrap = diceResult * 10;
                currentPG.scrap = currentPG.scrap ? currentPG.scrap + scrap : scrap;
            } else if (itemCode == "MECHANIC_KIT"){
                let descriptionItem = await translate.translate('ULTIMA_ROTTA.ITEMS.' + itemCode);
                if (descriptionItem) {
                    currentPG.inventory?.push(descriptionItem as string);
                }
            } else {
                let correctTable: { [key: number]: string } = (this.items as any)[itemCode];
                let diceResult = this.generateRandomNumber(8);
                let randomItem  = correctTable[diceResult];
                let descriptionItem = await translate.translate('ULTIMA_ROTTA.ITEMS.' + randomItem);

                if(itemCode =="WEAPON_1" || itemCode =="WEAPON_2"){
                    let weaponGradeNumber = this.generateRandomNumber(6);
                    if(weaponGradeNumber < 5){
                        let weaponGrade = await translate.translate('ULTIMA_ROTTA.ITEMS.LABEL_DEGRADATION');
                        descriptionItem = descriptionItem + " - " + weaponGrade;
                    }
                }

                if(itemCode =="SUSTENANCE" && diceResult == 8){
                    let elettrolitaTypeNumber = this.generateRandomNumber(6);
                    let elettroitaTable: { [key: number]: string } = (this.items as any)["ELETTROLITA"];
                    let elettrolitaType = elettroitaTable[elettrolitaTypeNumber];
                    let elettrolitaTypeDescription = await translate.translate('ULTIMA_ROTTA.ITEMS.ELETTROLITA.' + elettrolitaType);
                    descriptionItem = descriptionItem + " - " + elettrolitaTypeDescription;
                }

                if (descriptionItem) {
                    currentPG.inventory?.push(descriptionItem as string);
                }

              
            }
        });
    }

    private static generateTraits(maxInt: number): Trait {
        let randomInt = this.generateRandomNumber(maxInt);
        let getCodeFromMapping = this.getKeyByValue(traitTraceMapping, randomInt);
        let trait = this.traitsDefaultData.find((t) => t.code === getCodeFromMapping);
        if (!trait) {
            throw new Error(getCodeFromMapping + ' non trovato');
        }
        return trait as Trait;
    }

    private static applyTraits(newPg: CharacterSheetLUR, translate: TranslationMessageService): void {
        let trait = this.generateTraits(20);
        this.switchTraits(newPg, trait, translate);

    }

    private static switchTraits(newPg: CharacterSheetLUR, trait: Trait, translate:TranslationMessageService): void {
        newPg.traits?.push(trait);
        try {
            switch (trait.code) {
                case TraitsType.CICATRICE: {
                    // Logic for CICATRICE
                    this.addLifeMana(newPg, -1, 0);
                    break;
                }
                case TraitsType.MALATO_DIFETTOSO: {
                    try {
                        // Logic for MALATO_DIFETTOSO

                        let isBios = newPg.genetic.code === GeneticType.Bios;
                        // Se isBios è vero, filtra le abilità diverse da 'MALATO_DIFETTOSO', altrimenti usa tutte le abilità
                        const availableAbilities = isBios ? newPg.genetic.abilities.filter((ability) => ability.code !== 'ARTIFICIALE') : newPg.genetic.abilities;

                        // Se ci sono abilità disponibili, scegli una a caso
                        if (availableAbilities.length > 0) {
                            const randomIndex = this.generateRandomNumber(availableAbilities.length) - 1;
                            const selectedAbility = availableAbilities[randomIndex];
                            const codeToDelete = selectedAbility.code;

                            newPg.genetic.abilities = newPg.genetic.abilities.filter((a) => a.code !== codeToDelete);


                            let currentExcellence = newPg.excellence?.split('-') as string[];
                            let currentExCode: string[] = [];
                            currentExcellence.forEach((ex) => {
                                let code = attributeKeys.find((attr) => attr.description === ex)?.code;
                                if (code) {
                                    currentExCode.push(code);
                                }
                            });
                            let randomStr = this.distinctRandomStat([StatsType.AGILITY, StatsType.COURAGE, StatsType.STRENGTH, StatsType.INTELLIGENCE, StatsType.MAGIC, StatsType.MANUALITY, StatsType.PERCEPTION, StatsType.SOCIALITY], currentExCode);
                            newPg.excellence = currentExcellence.join('-') + ' - ' + newPg.attributes.find((attr) => attr.code === randomStr)?.description;
                        }
                    }
                    catch (error) {
                        throw new Error('ERROR ON' + trait.code);
                    }
                    break;
                }
                case TraitsType.AGIATO: {
                    newPg.scrap = newPg.scrap ? newPg.scrap + 50 : 50;
                    break;
                }
                case TraitsType.SPIETATO: {
                    this.addLifeMana(newPg, 0, -1);
                    break;
                }
                case TraitsType.FRONT_MAN: {
                    this.updateAttributes(newPg.attributes, StatsType.SOCIALITY, 1);
                    break;
                }
                case TraitsType.ROTTMATORE: {
                    // Logic for ROTTAMATORE
                    this.updateAttributes(newPg.attributes, StatsType.MANUALITY, 1);
                    this.updateInventory(["MECHANIC_KIT"], newPg, translate);
                    let scrap = this.getMaxRandomValue(20, 3, 0) + 10;
                    newPg.scrap = newPg.scrap ? newPg.scrap + scrap : scrap;
                    break;
                }
                case TraitsType.SEI_PROPRIO_GROSSO: {
                    // Logic for SEI_PROPRIO_GROSSO
                    this.addLifeMana(newPg, 2, 0);
                    break;
                }
                case TraitsType.HAI_UNA_SCINTILLA: {
                    // Logic for HAI_UNA_SCINTILLA
                    this.addLifeMana(newPg, 0, 1);
                    break;
                }
                case TraitsType.TALENTO_NATURALE: {
                    // Logic for TALENTO_NATURALE
                    let roleCode = this.getKeyByValue(roleTraceMapping, this.generateRandomNumber(4));
                    let roleRandom = this.rolesDefaultData.find((r) => r.code === roleCode) as Role;

                    let abilityRole = roleRandom.abilities as Ability[];
                    let abilityRandom = this.generateRandomNumber(10);
                    let ability = abilityRole[abilityRandom - 1];

                    newPg.role?.abilities ? newPg.role?.abilities.push(ability) : [ability];

                    break;
                }
                case TraitsType.GENETICA_MISTA: {
                    // Logic for GENETICA_MISTA
                    this.updateAttributes(newPg.attributes, StatsType.SOCIALITY, -1);

                    let humanAbility = this.geneticDefaultData.find((r) => r.code === GeneticType.Umanoide)?.abilities as Ability[];
                    // Filtra le abilità che non sono già incluse in `newPg.role?.abilities`
                    const availableAbilities = humanAbility.filter((ability) => !newPg.genetic?.abilities.includes(ability));

                    // Se ci sono abilità disponibili, scegli una a caso
                    if (availableAbilities.length > 0) {
                        const abilityRandomIndex = this.generateRandomNumber(availableAbilities.length);
                        const selectedAbility = availableAbilities[abilityRandomIndex - 1];
                        newPg.genetic?.abilities.push(selectedAbility);
                    }
                    break;
                }
                case TraitsType.TIRA_DUE_VOLTE: {
                    try {
                        let traitGenerated = newPg.traits as Trait[];

                        for (let i = 0; i < 2; i++) {
                            const availableTraits = this.traitsDefaultData.filter((trait) => !traitGenerated.some((generatedTrait) => generatedTrait.code === trait.code));

                            if (availableTraits.length > 0) {
                                const randomIndex = this.generateRandomNumber(availableTraits.length);
                                const newTrait = availableTraits[randomIndex - 1];
                                this.switchTraits(newPg, newTrait, translate);
                            }
                        }
                    }
                    catch (error) {
                        throw new Error(error as any);
                    }
                    break;
                }
                case TraitsType.ARMA_EXTRA_1:
                    {
                        // Logic for ARMA_EXTRA_1
                        this.updateInventory(["WEAPON_1"], newPg, translate);
                        break
                    }
                case TraitsType.ARMA_EXTRA_2:
                    {
                        // Logic for ARMA_EXTRA_2
                        this.updateInventory(["WEAPON_2"], newPg, translate);
                        break
                    }
                case TraitsType.DUE_VITE:
                case TraitsType.RUOLO_FACILITATO_ARCANISTA_O_DISCEPOLO_OSCURO:
                case TraitsType.RUOLO_FACILITATO_CANAGLIA_O_RICOGNITORE:
                case TraitsType.RUOLO_FACILITATO_LEADER_O_SOLDATO:
                case TraitsType.VENDICATIVO:
                case TraitsType.SANGUINARIO:
                case TraitsType.INCUBI: {
                    break;
                }

            }
        } catch (error) {
            throw new Error("Error su " + trait.code + " - " + error);
        }
    }

    private static getMaxRandomValue(max: number, times: number, bonus: number): number {
        let highestValue = 0;
        if (times === 0) {
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

    private static getKeyByValue = (dictionary: { [key: string]: any }, input: number): number | string | undefined => {
        let d = Object.entries(dictionary).find(([, value]) =>
            Array.isArray(value) ? value.includes(input) : value === input
        )?.[0] as number | string | undefined;

        return d;
    };

    private static async getDescriptionFromCode(code: string, description: string | undefined, translationMessageService: TranslationMessageService): Promise<string> {
        if (description) {
            return description;
        }
        if (!code) {
            throw new Error('Code is not defined');
        }
        return await translationMessageService.translate(code);

    }

    static async CovertToCharacterToFree(newPg: CharacterSheetLUR, translationMessageService: TranslationMessageService): Promise<CharacterSheetLURTemplate> {
        let newPgFree = {} as CharacterSheetLURTemplate;
        newPgFree.name = newPg.name;
        newPgFree.excellence = newPg.excellence;

        let geneticDescription = await this.getDescriptionFromCode('ULTIMA_ROTTA.GENETIC.' + newPg.genetic.code, newPg.genetic.description, translationMessageService);
        let roleDescription = await this.getDescriptionFromCode('ULTIMA_ROTTA.ROLE.' + newPg.role?.code, newPg.role?.description, translationMessageService);
        newPgFree.genetic_and_role = geneticDescription + ' - ' + roleDescription;

        newPgFree.attributes = structuredClone(newPg.attributes);
        newPgFree.mana = newPg.mana;
        newPgFree.manaCurrent = newPg.manaCurrent;
        newPgFree.life = newPg.life;
        newPgFree.lifeCurrent = newPg.lifeCurrent;
        newPgFree.armor = newPg.armor;
        newPgFree.armorDetails = newPg.armorDetails;
        newPgFree.allEquipment = newPg.inventory?.join('\n');
        newPgFree.scrap = newPg.scrap;
        newPgFree.point_adventure = newPg.point_adventure;
        newPgFree.background = newPg.background;
        newPgFree.ship = newPg.ship;
        newPgFree.redemption = newPg.redemption;
        const allAbilities: string[] = await this.mapAbilities(newPg.genetic.abilities, newPg.role?.abilities, translationMessageService);
        newPgFree.allAbilities = allAbilities.join('\n');

        return newPgFree;
    }

    static async mapAbilities(geneticAbility: Ability[], roleAbility: Ability[] | undefined, translationMessageService: TranslationMessageService): Promise<string[]> {
        let allAbilities: string[] = [];
        if (geneticAbility) {
            const geneticAbilities = await Promise.all(
                geneticAbility.map(async (skill) => {
                    const idml = 'ULTIMA_ROTTA.ABILITY.' + skill.code;
                    const description = await this.getDescriptionFromCode(idml, skill.description, translationMessageService);
                    return description as string;
                })
            );
            allAbilities.push(...geneticAbilities);
        }
        if (roleAbility) {
            const roleAbilities = await Promise.all(
                roleAbility.map(async (skill) => {
                    const description = await this.getDescriptionFromCode('ULTIMA_ROTTA.ABILITY.' + skill.code, skill.description, translationMessageService);
                    return description as string;
                })
            );
            allAbilities.push(...roleAbilities);
        }

        return allAbilities;
    }
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

export const fieldMapPDFLUR = {
    "SONO": "name",
    "GENETICA E RUOLO": "genetic_and_role",
    "ECCELLENZA": "excellence",
    "RUOLO NELLA CIURMA": "role_in_the_crew",
    "IMMAGINE": "", //TODO

    "AGILITÀ D": "attributes[0].value",
    "AGILITÀ BONUS": "attributes[0].bonus",
    "CORAGGIO D": "attributes[1].value",
    "CORAGGIO BONUS": "attributes[1].bonus",
    "FORZA D": "attributes[2].value",
    "FORZA BONUS": "attributes[2].bonus",
    "INTELLIGENZA D": "attributes[3].value",
    "INTELLIGENZA BONUS": "attributes[3].bonus",
    "MAGIA D": "attributes[4].value",
    "MAGIA BONUS": "attributes[4].bonus",
    "MANUALITÀ D": "attributes[5].value",
    "MANUALITÀ BONUS": "attributes[5].bonus",
    "PERCEZIONE D": "attributes[6].value",
    "PERCEZIONE BONUS": "attributes[6].bonus",
    "SOCIALITÀ D": "attributes[7].value",
    "SOCIALITÀ BONUS": "attributes[7].bonus",

    "SALUTE": "life",
    "SALUTE ATTUALE": "lifeCurrent",
    "MANA": "mana",
    "MANA ATTUALE": "manaCurrent",
    "ARMATURA": "armor",
    "NAVE": "ship",

    "ABILITÀ": "allAbilities",

    "CORPO": "armorDetails.body",
    "TESTA": "armorDetails.head",
    "BRACCIO DX": "armorDetails.rightArm",
    "BRACCIO SX": "armorDetails.leftArm",
    "GAMBA DX": "armorDetails.rightLeg",
    "GAMBA SX": "armorDetails.leftLeg",

    "EQUIPAGGIAMENTO": "allEquipment",
    "BACKGROUND": "background",

    "ROTTAMI": "scrap",
    "PUNTI AVVENTURA": "point_adventure",
    /*     RISCATTO
    "1": "traits[0].isSelected",
    "2": "traits[1].isSelected",
    "3": "traits[2].isSelected",
    "4": "traits[3].isSelected",
    "5": "traits[4].isSelected",
    "6": "traits[5].isSelected",
    "7": "traits[6].isSelected",
    "8": "traits[7].isSelected",
    "9": "traits[8].isSelected",
    "10": "traits[9].isSelected", 
    */

    /* Pregio
    "COR P": "attributes[2].proficiency",
    "FOR P": "attributes[3].proficiency",
    "INT P": "attributes[4].proficiency",
    "MAG P": "attributes[5].proficiency",
    "MAN P": "attributes[6].proficiency",
    "PER P": "attributes[7].proficiency",
    "AGI P": "attributes[1].proficiency",
    "SOC P": "attributes[0].proficiency"
    */
};

export const fieldsToResize: FieldResizeConfig[] = [
    { fieldName: 'ABILITÀ', width: 140, height: 270, x: 63, y: 170, fontSize: 12 },
    { fieldName: 'EQUIPAGGIAMENTO', width: 330, height: 100, x: 225, y: 150, fontSize: 10 },
    { fieldName: 'BACKGROUND', width: 480, height: 50, x: 70, y: 70, fontSize: 10 },
];