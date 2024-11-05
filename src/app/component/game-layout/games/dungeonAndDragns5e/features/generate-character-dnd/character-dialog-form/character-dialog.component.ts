import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { SharedModule } from '../../../../../../../shared/shared.module';
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

    character: any = {};
    sessionId: string | undefined ="";

    constructor(
        public dialogRef: MatDialogRef<CharacterDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { 
            character: any
            sessionId: string| undefined
         },
         private translationMessageService: TranslationMessageService,
    ) {
        this.character = data.character;
        this.sessionId = data.sessionId;
    }

    async ngOnInit(): Promise<void> {
        
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
