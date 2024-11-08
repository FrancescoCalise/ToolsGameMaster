import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { SharedModule } from '../../../../../../../shared/shared.module';
import { SharedFields } from '../../../../../../../shared/shared-fields.module';
import { CharacterSheetDND5ETemplate } from '../charachter-sheet-dnd5e';
import { DynamicWrapperModalComponent } from '../../../../../../framework/modal/dynamic-wrapper-modal.component';

@Component({
    selector: 'app-character-dialog',
    templateUrl: './character-dialog-dnd5e.component.html',
    styleUrls: ['./character-dialog-dnd5e.component.css'],
    standalone: true,
    imports: [
        SharedModule,
        SharedFields,
        DynamicWrapperModalComponent
    ]
})
export class CharacterDialogDND5eComponent implements OnInit {

    characterForm: FormGroup;
    attributes = [
        { label: 'Strength (STR)', control: 'STR' },
        { label: 'Dexterity (DEX)', control: 'DEX' },
        { label: 'Constitution (CON)', control: 'CON' },
        { label: 'Intelligence (INT)', control: 'INT' },
        { label: 'Wisdom (WIS)', control: 'WIS' },
        { label: 'Charisma (CHA)', control: 'CHA' },
    ];
    modifiers = ['STRmod', 'DEXmod', 'CONmod', 'INTmod', 'WISmod', 'CHAmod'];

    constructor(
        public dialogRef: MatDialogRef<CharacterDialogDND5eComponent>,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: { character: CharacterSheetDND5ETemplate, sessionId: string | undefined },
    ) {
        this.characterForm = this.fb.group({
            CharacterName: [null],
            Class: [null],
            Level: [null],
            Race: [null],
            Background: [null],
            Alignment: [null],
            Gender: [null],
            STR: [null],
            STRmod: [null],
            DEX: [null],
            DEXmod: [null],
            CON: [null],
            CONmod: [null],
            INT: [null],
            INTmod: [null],
            WIS: [null],
            WISmod: [null],
            CHA: [null],
            CHAmod: [null],
            ProficiencyBonus: [null],
            HPMax: [null],
            AC: [null],
            Initiative: [null],
            Speed: [null],
            WeaponProfency: [null],
            ToolsProfency: [null],
            Languages: [null],
            RacialTraits: [null],
            BackgroundFeature: [null],
            ClassPrivilegs: [null],
        });
    }

    ngOnInit(): void {
        if (this.data.character) {
            this.characterForm.patchValue(this.data.character);
        }
    }

    save(): void {
        if (this.characterForm.valid) {
            this.dialogRef.close(this.characterForm.value);
        }
    }

    close(): void {
        this.dialogRef.close();
    }
}