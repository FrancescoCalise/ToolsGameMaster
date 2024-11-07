import { Component, Inject, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { TranslationMessageService } from '../../../../services/translation-message-service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { DynamicWrapperModalComponent } from '../../../framework/modal/dynamic-wrapper-modal.component';
import { SharedFields } from '../../../../shared/shared-fields.module';

export interface StepperData {
    template: any;
    prompt_1: string,
    formGroup: FormGroup,
    formFields: FormField[],
}

export interface FormField {
    label: string;
    controlName: string;
    type: string;
}

@Component({
    selector: 'app-dialog-ai-generation',
    standalone: true,
    imports: [
        SharedModule,
        DynamicWrapperModalComponent,
        SharedFields
    ],
    templateUrl: './dialog-ai-generation.component.html',
    styleUrls: ['./dialog-ai-generation.component.css']
})
export class DialogAiGeneration implements OnInit {
    promptCopied = false;
    jsonForm = new FormGroup({
        jsonResponse: new FormControl('', Validators.required),
    });

    formGroup: FormGroup = {} as FormGroup;
    formFields: FormField[] = [];

    readonly template: any;

    jsonFields = "";
    lang = this.translationMessageService.getLanguage();
    originalPromptPart1: string = "";

    promptPart1: string = "";
    promptPart2: string = "Per farlo devi compilarmi correttamente questo JSON {json}.";
    promptPart3: string = "";
    promptPart4: string = `STEPPER_DIALOG.PROMPT_4`;

    get prompt() {
        return this.promptPart1 + '\n' + this.promptPart2_converted + '\n' + this.promptPart3 + '\n' + this.promptPart4;
    }

    get promptUserInfo() {
        return this.promptPart1 + this.promptPart3;
    }
    get promptPart2_converted() {
        return this.promptPart2.replace('{json}', this.jsonFields);
    }

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: StepperData,
        private translationMessageService: TranslationMessageService,
        private dialogRef: MatDialogRef<DialogAiGeneration>,
        private fb: FormBuilder
    ) {
        if (data) {
            this.template = data.template;
            this.formGroup = data.formGroup,
            this.formFields = data.formFields;
            this.promptPart1 = data.prompt_1;
            this.originalPromptPart1 = data.prompt_1;
            this.jsonFields = this.generateInterfaceString(this.template);
            this.jsonForm =  this.fb.group({
                jsonResponse: ['',Validators.required ,[this.jsonTemplateValidatorAsync(this.template)]]
            });
        }
    }

    async ngOnInit(): Promise<void> {
        this.promptPart4 = await this.translationMessageService.translate(this.promptPart4, { lang: this.lang });
    }

    generateInterfaceString<T extends object>(template: T): string {
        const parseType = (value: any): string => {
            if (Array.isArray(value)) {
                // Determina il tipo di elemento dell'array
                const elementType = value.length > 0 ? parseType(value[0]) : 'any';
                return `${elementType}[]`;
            } else if (typeof value === 'object' && value !== null) {
                // Chiamata ricorsiva per oggetti annidati
                return this.generateInterfaceString(value);
            } else if (typeof value === 'string' || value === null) {
                return 'string';
            } else if (typeof value === 'number') {
                return 'number';
            } else if (typeof value === 'boolean') {
                return 'boolean';
            } else {
                return 'any';
            }
        };

        const templateKeys = Object.keys(template) as Array<keyof T>;

        return templateKeys.reduce((interfaceString, key) => {
            if (key === 'sessionId') return interfaceString;

            const value = template[key];
            const optionalFlag = value === undefined ? '?' : '';
            const typeString = parseType(value);

            return interfaceString + `    ${String(key)}${optionalFlag}: ${typeString};\n`;
        }, "{\n") + "}";
    }


    copyPrompt() {
        navigator.clipboard.writeText(this.prompt).then(
            () => {
                this.promptCopied = true;
            },
            (err) => {
                console.error('Errore nella copia del testo', err);
                this.promptCopied = false;
            }
        );
    }

    
    openChatGPT(): void {
        window.open('https://chat.openai.com/', '_blank', 'noopener,noreferrer');
    }
    
    cancel(){
        this.dialogRef.close();
    }
    
    finish() {
        if (this.jsonForm.valid) {
            this.dialogRef.close(this.jsonForm.value.jsonResponse);
        } else {
            alert('Completa il campo JSON di risposta prima di chiudere.');
        }
    }

    updatePromptPart1(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const value = inputElement.value;
        this.promptPart1 = this.originalPromptPart1;

        if (!value) {
            return;
        }
        this.formFields.forEach(field => {
            const fieldValue = this.formGroup.get(field.controlName)?.value || '';
            const regex = new RegExp(`{${field.controlName}}`, 'g');
            this.promptPart1 = this.promptPart1.replace(regex, fieldValue);
        });
    }

    jsonTemplateValidatorAsync(template: any): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            try {
                const parsedValue = JSON.parse(control.value);

                const isValid = this.validateTemplate(parsedValue, template);

             return of(isValid ? null : { invalidJsonTemplate: true });
    
            } catch (e) {
                return of({ invalidJsonFormat: true });
            }
        };
    }

    validateTemplate(parsedValue: any, template: any): boolean {
        // Controlla che ogni chiave di template esista in parsedValue e che i tipi corrispondano
        return Object.keys(template).every(key => {
            if (key === 'sessionId') return true;
            return key in parsedValue && typeof parsedValue[key] === typeof template[key];
        });
    }
}
