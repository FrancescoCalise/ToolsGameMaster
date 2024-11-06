import { Component, OnInit } from "@angular/core";
import { SharedFields } from "../../../../../../shared/shared-fields.module";
import { SharedModule } from "../../../../../../shared/shared.module";
import { createEmptyMonster, Monster } from "../../interface/bestiary-interface";
import { MatDialog } from "@angular/material/dialog";
import { PNGreviewDialogComponent } from "./png-card-pewview/png-card-preview-componenet";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { SpinnerService } from "../../../../../../services/spinner.service";
import { FormField, DialogAiGeneration, StepperData } from "../../../../feature-sitemap/dialog-ai-generation/dialog-ai-generation.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { TranslationMessageService } from "../../../../../../services/translation-message-service";

@Component({
    selector: 'app-png-generator-5e',
    templateUrl: './png-generator-5e.component.html',
    styleUrls: ['./png-generator-5e.component.css'],
    standalone: true,
    imports: [
        SharedModule,
        SharedFields
    ]
})
export class PNGGenerator5eComponent implements OnInit {
    templates: Monster[] = []; // Variabile per contenere gli elementi della dropdown
    filteredTemplates: Monster[] = [];
    filterText: string = '';
    monster: Monster = createEmptyMonster();
    // Definizione degli attributi e tiri salvezza con tipi espliciti
    attributes: Array<keyof Monster['attributes']> = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
    savingThrows: Array<keyof Monster['savingThrows']> = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

    translationIds: { [key: string]: string } = {
        // Attributi
        strength: 'DUNGEON_AND_DRAGONS_5E.PNG_GENERATOR.STRENGTH',
        dexterity: 'DUNGEON_AND_DRAGONS_5E.PNG_GENERATOR.DEXTERITY',
        constitution: 'DUNGEON_AND_DRAGONS_5E.PNG_GENERATOR.CONSTITUTION',
        intelligence: 'DUNGEON_AND_DRAGONS_5E.PNG_GENERATOR.INTELLIGENCE',
        wisdom: 'DUNGEON_AND_DRAGONS_5E.PNG_GENERATOR.WISDOM',
        charisma: 'DUNGEON_AND_DRAGONS_5E.PNG_GENERATOR.CHARISMA',

        // Tiri Salvezza
        strengthSave: 'DUNGEON_AND_DRAGONS_5E.PNG_GENERATOR.STRENGTH_SAVE',
        dexteritySave: 'DUNGEON_AND_DRAGONS_5E.PNG_GENERATOR.DEXTERITY_SAVE',
        constitutionSave: 'DUNGEON_AND_DRAGONS_5E.PNG_GENERATOR.CONSTITUTION_SAVE',
        intelligenceSave: 'DUNGEON_AND_DRAGONS_5E.PNG_GENERATOR.INTELLIGENCE_SAVE',
        wisdomSave: 'DUNGEON_AND_DRAGONS_5E.PNG_GENERATOR.WISDOM_SAVE',
        charismaSave: 'DUNGEON_AND_DRAGONS_5E.PNG_GENERATOR.CHARISMA_SAVE'
    };

    aiPrompt_1: string = 'Generami un mostro / PNG per D&D 5e di grado sfida {challengeRating}.\n';

    constructor(private dialog: MatDialog, private http: HttpClient, private spinnerService: SpinnerService, private translationMessageService: TranslationMessageService) {
    }

    async ngOnInit(): Promise<void> {
        this.spinnerService.show("PngGenerator5eComponent.ngOnInit");
        await this.loadTemplates();
        this.spinnerService.hide("PngGenerator5eComponent.ngOnInit");
    }

    async loadTemplates(): Promise<void> {
        try {
            const data: Monster[] = await firstValueFrom(this.http.get<Monster[]>('/assets/dnd/bestiary/bestiary.json'));
            this.templates = data;
            console.log('Templates:', data.length);
            this.filteredTemplates = data; // Imposta i dati iniziali filtrati

        } catch (error) {
            console.error('Errore nel caricamento dei template:', error);
        }
    }

    filterTemplates(): void {
        const searchText = this.filterText.toLowerCase();
        this.filteredTemplates = this.templates.filter(template =>
            template.name.toLowerCase().includes(searchText)
        );
    }

    selectTemplate(template: Monster): void {
        this.monster = { ...template };
    }

    addSkill() {
        this.monster.skills = [...this.monster.skills, '']; // Aggiunge una skill vuota
    }

    removeSkill(index: number) {
        this.monster.skills = this.monster.skills.filter((_, i) => i !== index); // Rimuove la skill all'indice specificato
    }

    trackByIndex(index: number, item: any): number {
        return index;
    }

    // Metodi per Traits
    addTrait() {
        this.monster.traits.push({ name: '', description: '', attack: '' });
    }

    removeTrait(index: number) {
        this.monster.traits.splice(index, 1);
    }

    // Metodi per Actions
    addAction() {
        this.monster.actions.push({ name: '', description: '', attack: '' });
    }

    removeAction(index: number) {
        this.monster.actions.splice(index, 1);
    }

    // Metodi per Legendary Actions
    addLegendaryAction() {
        this.monster.legendaryActions.push({ name: '', description: '' });
    }

    removeLegendaryAction(index: number) {
        this.monster.legendaryActions.splice(index, 1);
    }

    // Metodi per Spells
    addSpell() {
        this.monster.spells.push({ level: 0, spellName: '' });
    }

    removeSpell(index: number) {
        this.monster.spells.splice(index, 1);
    }

    // Metodo per Spell Slots
    addSpellSlot() {
        this.monster.spellSlots.push(0); // Aggiunge uno slot con valore predefinito 0
    }

    removeSpellSlot(index: number) {
        this.monster.spellSlots.splice(index, 1);
    }

    async loadFromAI(){
        let formBuilder = new FormGroup({
            challengeRating: new FormControl('', [Validators.min(1), Validators.max(20)])
        });
        let labelLevel = await this.translationMessageService.translate('DUNGEON_AND_DRAGONS_5E.PNG_GENERATOR.CHALLENGE_RATING')
        let formFields: FormField[] = [
            { label: labelLevel, controlName: 'challengeRating', type: 'number' }
        ];

        let sheetPrefill = structuredClone(this.monster);
        sheetPrefill.attributes = {
            strength: 0,
            dexterity: 0,
            constitution: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0
        },
        sheetPrefill.savingThrows = {
            strength: '',
            dexterity: '',
            constitution: '',
            intelligence: '',
            wisdom: '',
            charisma: ''
        };
        sheetPrefill.skills = [""];
        sheetPrefill.traits = [{ name: '', description: '', attack: '' }];
        sheetPrefill.actions = [{ name: '', description: '', attack: '' }];
        sheetPrefill.legendaryActions = [{ name: '', description: '' }];
        sheetPrefill.spells = [{ level: 0, spellName: '' }];
        sheetPrefill.spellSlots = [0,1,2];

        let stepperData: StepperData = {
            template: sheetPrefill,
            prompt_1: this.aiPrompt_1,
            formGroup: formBuilder,
            formFields: formFields
        }
        let dialogRef = this.dialog.open(DialogAiGeneration, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            data: stepperData
        });
        
        try {
            const result = await firstValueFrom(dialogRef.afterClosed());
            if (result && JSON.parse(result) as Monster) {
               this.monster = JSON.parse(result) as Monster;
            } else if(result){
                throw new Error("Error in the creation of the character");
            }
            return;
        } catch (error) {
            console.error(error);
            throw new Error("Dialog closed without a result or error in character creation.");
        }

    }

    // Metodo per visualizzare l'anteprima
    showPreview() {
        this.dialog.open(PNGreviewDialogComponent, {
            panelClass: 'png-container-dialog',
            data: this.monster
        });
    }
}