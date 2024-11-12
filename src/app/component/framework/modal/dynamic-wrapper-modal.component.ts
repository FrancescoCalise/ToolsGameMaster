import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslationMessageService } from '../../../services/translation-message-service';
import { SharedModule } from '../../../shared/shared.module';
import { SharedFields } from '../../../shared/shared-fields.module';
import { ButtonConfig } from '../fields/field-button/field-button.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-dynamic-wrapper-modal',
    templateUrl: './dynamic-wrapper-modal.component.html',
    styleUrl: './dynamic-wrapper-modal.component.css',
    standalone: true,
    imports: [
        SharedModule,
        SharedFields
    ]
})

export class DynamicWrapperModalComponent implements OnInit {

    @Input() IdmlTitle: string = '';
    title: string = '';

    @Input() customAction?: ButtonConfig[];
    @Input() dialogRef?: MatDialogRef<any, any>;

    private customDialog?: MatDialogRef<any, any>;

    dialogAction: ButtonConfig[] = [
        {
            colorClass: 'btn-danger',
            icon: 'close',
            tooltip: 'COMMON.CLOSE',
            action: () => this.close(),
            disabled: false,
            isSystem: true
        }
    ];

    constructor(private translationMessageService: TranslationMessageService) {
        
    }

    get sortedDialogActions(): ButtonConfig[] {
        return this.dialogAction.sort((a, b) => Number(a.isSystem) - Number(b.isSystem));
    }

    async ngOnInit(): Promise<void> {
        if(this.IdmlTitle)
            this.title = await this.translationMessageService.translate(this.IdmlTitle);

        if (this.customAction) {
            this.dialogAction = [...this.dialogAction, ...this.customAction];
        }

        if (this.dialogRef) {
            this.customDialog = this.dialogRef;
        }
       
    }

    closeDialog() {
        if (this.customDialog) {
            this.customDialog.close();
        }
    }

    close() {
        this.closeDialog();
    }
}
