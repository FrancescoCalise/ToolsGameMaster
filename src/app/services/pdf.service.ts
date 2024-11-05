import { Injectable } from '@angular/core';
import { PDFDocument, PDFFont, PDFTextField, PDFForm, PDFCheckBox } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';


@Injectable({
    providedIn: 'root'
})
export class PdfService {

    private pdfDoc: PDFDocument = {} as PDFDocument;
    private form: PDFForm = {} as PDFForm;
    private pdfBytes: ArrayBuffer = new ArrayBuffer(0);

    // Carica il PDF e ottieni il modulo
    async loadPdf(pdfPath: string): Promise<void> {
        try {
            debugger
            const pdfBytes = await fetch(pdfPath).then(res => res.arrayBuffer());
            this.pdfDoc = await PDFDocument.load(pdfBytes);
            this.form = this.pdfDoc.getForm();
            this.pdfBytes = pdfBytes;
        }catch (error) {
            console.error('Error loading PDF:', error);
        }
    }

    getCurrentPDF(): PDFDocument {
        return this.pdfDoc;
    }   
    getCurrentPDFBytes(): ArrayBuffer {
        return this.pdfBytes;
    }

    // Ottiene tutti i campi di modulo presenti nel PDF
    getAllFields(): PdfField[] {
        return this.form.getFields().map(field => {
            const fieldName = field.getName();
            let fieldValue = null;
            let fieldType = '';

            if (field instanceof PDFTextField) {
                fieldValue = field.getText();
                fieldType = 'TextField';
            } else if (field instanceof PDFCheckBox) {
                fieldValue = field.isChecked();
                fieldType = 'CheckBox';
            } else {
                fieldType = 'Unknown';
            }

            return {
                name: fieldName,
                type: fieldType,
                value: fieldValue
            };
        });
    }

    // Mappa i campi del PDF con i campi dell'oggetto usando un dizionario
    updateValues(fieldValues: { [pdfFieldName: string]: any }, fieldMap: { [pdfFieldName: string]: string }): void {
        if (!this.form) return;
        Object.keys(fieldMap).forEach(pdfFieldName => {
            const objectFieldValue = this.getObjectFieldValue(fieldValues, fieldMap[pdfFieldName]);
            if (typeof objectFieldValue === 'string') {
                const textField = this.form.getTextField(pdfFieldName);
                textField.setText(objectFieldValue);
            } else if (typeof objectFieldValue === 'number') {
                const textField = this.form.getTextField(pdfFieldName);

                if (objectFieldValue == 0) {
                    textField.setText('');
                } else {
                    textField.setText(objectFieldValue.toString());
                }
            }
            else if (typeof objectFieldValue === 'boolean') {
                const checkBox = this.form.getCheckBox(pdfFieldName);
                objectFieldValue ? checkBox.check() : checkBox.uncheck();
            }
        });
    }

    getObjectFieldValue(newChar: { [pdfFieldName: string]: any; }, elementToGet: string): any {
        // Verifica se `elementToGet` contiene una struttura di array (es. "attributes[0].value")
        const arrayPattern = /(.*?)\[(\d+)\]/; // Cattura il nome del campo e l'indice

        if (arrayPattern.test(elementToGet)) {
            // Ottiene il nome del campo e l'indice dall'espressione
            const [_, arrayField, indexStr] = elementToGet.match(arrayPattern) || [];
            const index = parseInt(indexStr, 10); // Converte `index` in numero

            // Ottiene il valore del campo `arrayField`, che dovrebbe essere un array
            const arrayValue = newChar[arrayField];

            // Se `arrayValue` è un array, ritorna l'elemento all'indice specificato
            if (Array.isArray(arrayValue)) {
                // Estrai il resto della proprietà (es. "value" in "attributes[0].value")
                const remainingPath = elementToGet.split('.').slice(1).join('.');

                if (remainingPath) {
                    // Accedi al valore dell'oggetto all'interno dell'array usando il percorso rimanente
                    return this.getObjectFieldValue(arrayValue[index], remainingPath);
                } else {
                    // Ritorna direttamente l'elemento dell'array se non c'è altro nel percorso
                    return arrayValue[index];
                }
            }
        } else {
            // Se non è un array, restituisce il valore direttamente
            return newChar[elementToGet];
        }

        return undefined;
    }

    // Salva il PDF e ritorna i byte aggiornati
    async getPDFUpdated(): Promise<Uint8Array> {
        return await this.pdfDoc.save();
    }

    // Scarica il PDF aggiornato
    downloadPdf(data: Uint8Array, filename: string) {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    async resizeMultipleTextFields(pdfBytes: ArrayBuffer, fields: FieldResizeConfig[]): Promise<Uint8Array> {
        const pdfDoc = await PDFDocument.load(pdfBytes);
        pdfDoc.registerFontkit(fontkit);
        const fontUrl = '/assets/fonts/Roboto-Regular.ttf';
        const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
        const pdfFont: PDFFont = await pdfDoc.embedFont(fontBytes);

        const form = pdfDoc.getForm();

        for (const { fieldName, width, height, x, y, fontSize } of fields) {
            const textField = form.getTextField(fieldName);

            const [widget] = textField.acroField.getWidgets();
            widget.setRectangle({ x, y, width, height });

            textField.updateAppearances(pdfFont);
            textField.setFontSize(fontSize);
        };

        // Salva e restituisci il PDF modificato
        return await pdfDoc.save();
    }
}


export interface PdfField {
    name: string;
    type: string;
    value: any;
}

export interface FieldResizeConfig {
    fieldName: string;
    width: number;
    height: number;
    x: number;
    y: number;
    fontSize: number;
}