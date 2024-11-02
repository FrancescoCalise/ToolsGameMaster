import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { Ability, ArmorInfo, CharacterSheetLURTemplate, } from '../charachter-sheet-lur';
import { SharedModule } from '../../../../../../../shared/shared.module';
import { UtilitiesCreateCharacterLur } from '../utilities-create-character-lur/utilities-create-character-lur';
import { TranslationMessageService } from '../../../../../../../services/translation-message-service';
import { SharedFields } from '../../../../../../../shared/shared-fields.module';

@Component({
    selector: 'app-character-dialog',
    templateUrl: './character-dialog.component.html',
    styleUrls: ['./character-dialog.component.css'],
    standalone: true,
    imports: [
        SharedModule,
        SharedFields
    ]
})
export class CharacterDialogComponent implements OnInit {

    readonly rolesDefaultData = UtilitiesCreateCharacterLur.rolesDefaultData;
    readonly geneticDefaultData = UtilitiesCreateCharacterLur.geneticDefaultData;
    readonly attributeKeys = UtilitiesCreateCharacterLur.attributeKeys;
    readonly traits = UtilitiesCreateCharacterLur.traitsDefaultData;
    readonly armorDetails = UtilitiesCreateCharacterLur.armorDetails;

    character: CharacterSheetLURTemplate;;
    sessionId: string | undefined;

    armorInfoTable: ArmorInfo[] = [];
    displayedColumns: string[] = ['description', 'type', 'notes'];
    abilitiesSelectedArea: string = "";
    inventarioSelectedArea: string = "";
    selectedAbilities: Ability[] = [];
    selectedGenes: string[] = [];
    selectedArmorDetails: ArmorInfo[] = [];

    constructor(
        public dialogRef: MatDialogRef<CharacterDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { 
            character: CharacterSheetLURTemplate
            sessionId: string| undefined
         },
         private translationMessageService: TranslationMessageService,
    ) {
        this.character = data.character;
        this.sessionId = data.sessionId;
    }

    async ngOnInit(): Promise<void> {
        if(!this.character){
            this.character = await UtilitiesCreateCharacterLur.initCharacterForTemplate(this.sessionId, this.translationMessageService);
        }
    }

    save(form: NgForm) {
        if (form.valid) {
            this.dialogRef.close(this.character);
        }
    }

    close() {
        this.dialogRef.close();
    }

}
