import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { Ability, ArmorDetails, ArmorInfo, CharacterSheetLUR, } from '../charachter-sheet-lur';
import { SharedModule } from '../../../../../../../shared/shared.module';
import { UtilitiesCreateCharacterLur } from '../utilities-create-character-lur/utilities-create-character-lur';
import { SharedFieldsInputModule } from '../../../../../../../shared/shared-fields-input.module';

@Component({
    selector: 'app-character-dialog',
    templateUrl: './character-dialog.component.Backup.html',
    styleUrls: ['./character-dialog.component.css'],
    standalone: true,
    imports: [
        SharedModule,
        SharedFieldsInputModule 
    ]
})
export class CharacterDialogComponent implements OnInit {
    character: CharacterSheetLUR;
    readonly rolesDefaultData = UtilitiesCreateCharacterLur.rolesDefaultData;
    readonly geneticDefaultData = UtilitiesCreateCharacterLur.geneticDefaultData;
    readonly attributeKeys = UtilitiesCreateCharacterLur.attributeKeys;
    readonly traits = UtilitiesCreateCharacterLur.traitsDefaultData;
    readonly armorDetails  = UtilitiesCreateCharacterLur.armorDetails;

    armorInfoTable: ArmorInfo[] = [];
    displayedColumns: string[] = ['description', 'type', 'notes'];

    onImageChanged(newImage: string | ArrayBuffer | null): void {
        console.log('Immagine caricata:', newImage);
    }

    abilitiesSelectedArea: string = "";

    selectedAbilities: Ability[] = [];
    selectedGenes: string[] = [];
    selectedArmorDetails:ArmorDetails = {};

    constructor(
        public dialogRef: MatDialogRef<CharacterDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { character: CharacterSheetLUR }
    ) {
        this.character = data.character;
    }

    ngOnInit(): void {
        this.prefillSelected();
    }

    prefillSelected() {
        if(this.character.role){
            this.selectedAbilities = this.character.role.abilities || [];
        }
        if(this.character.genetic){
            this.selectedGenes = this.character.genetic.genes || [];
        }
        if(this.character.armorDetails){
            this.selectedArmorDetails = this.character.armorDetails || {};
        }

        let currentAbility =[];
        if(this.character.genetic.abilities){
            currentAbility.push(...this.character.genetic.abilities.map(a => a.description));
        }
        if(this.character.role?.abilities){
            currentAbility.push(...this.character.role.abilities.map(a => a.description));
        }

        if(currentAbility && currentAbility.length > 0){
            let parse = currentAbility as unknown as  string[];
            
            this.abilitiesSelectedArea = currentAbility.join('\n');
        }
        this.armorInfoTable = this.character.armorDetails?.details || [];
    }

    save(form: NgForm) {
        if (form.valid) {
            if(this.character.role){
                this.character.role.abilities = this.selectedAbilities as Ability[];
            }
            if(this.character.genetic){
                this.character.genetic.genes = this.selectedGenes;
            }
            this.dialogRef.close(this.character);
        }
    }

    close() {
        this.dialogRef.close();
    }


    getAbilityOption(roleId: string): Ability[] {
        const role = UtilitiesCreateCharacterLur.rolesDefaultData.find(r => r.code === roleId);
        return role ? role.abilities as Ability[] : [];
    }

    public getDefaultGenes(genesCode: string): string[] {
        return this.geneticDefaultData.find(gene => gene.code === genesCode)?.genes || [];

    }
    public showGenes() {
        return this.character.genetic?.genes;
    }
    getSafeGene(genes: any[], index: number): any {
        return genes && genes[index] ? genes[index] : '';
    }
}
