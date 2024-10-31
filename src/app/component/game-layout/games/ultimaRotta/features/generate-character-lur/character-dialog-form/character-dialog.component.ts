import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { Ability, CharacterSheetLUR, Genetic, Role, Trait } from '../charachter-sheet-lur';
import { SharedModule } from '../../../../../../../shared/shared.module';
import { UtilitiesCreateCharacterLur } from '../utilities-create-character-lur/utilities-create-character-lur';

@Component({
    selector: 'app-character-dialog',
    templateUrl: './character-dialog.component.html',
    styleUrls: ['./character-dialog.component.css'],
    standalone: true,
    imports: [
        SharedModule
    ]
})
export class CharacterDialogComponent {
    character: CharacterSheetLUR;
    readonly rolesDefaultData = UtilitiesCreateCharacterLur.rolesDefaultData;
    readonly geneticDefaultData = UtilitiesCreateCharacterLur.geneticDefaultData;
    readonly attributeKeys = UtilitiesCreateCharacterLur.attributeKeys;
    readonly traits = UtilitiesCreateCharacterLur.traitsDefaultData;
    
    selectedAbilities: Ability[] = [];
    selectedGenes: string[] = [];

    constructor(
        public dialogRef: MatDialogRef<CharacterDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { character: CharacterSheetLUR }
    ) {
        this.character = data.character;
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
}
