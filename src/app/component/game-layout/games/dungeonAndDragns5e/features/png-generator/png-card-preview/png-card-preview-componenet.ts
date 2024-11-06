import { Component, ViewChild, ElementRef, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { PNG_5E } from "../../../interface/png_5e-interface";
import { SharedModule } from "../../../../../../../shared/shared.module";
import html2canvas from 'html2canvas';

@Component({
    selector: 'app-png-card-preview-componenet',
    templateUrl: './png-card-preview-componenet.html',
    styleUrls: ['./png-card-preview-componenet.css'],
    standalone: true,
    imports: [
        SharedModule
    ]
})
export class PNGreviewDialogComponent {
    @ViewChild('pngCard') pngCard!: ElementRef;

    constructor(
        public dialogRef: MatDialogRef<PNGreviewDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: PNG_5E,
    ) { }

    downloadPNG() {
        const node = this.pngCard.nativeElement;
    
        html2canvas(node, { scale: 2, useCORS: true }).then((canvas) => {
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = `${this.data.name}.png`;
          link.click();
        }).catch(error => {
          console.error('Errore durante il download dell\'immagine:', error);
        });
      }

    isObjectEmpty(obj: any): boolean {
        let value = Object.values(obj)
            .every(value =>
                value === null ||
                value === undefined ||
                value === '' ||
                value === 0);

        return value
    }

    getModifierBonus(value: number): string {
        let bonus = Math.floor((value - 10) / 2);
        return bonus >= 0 ? `(+${bonus})` : `(${bonus})`;
    }

    public close(): void {
        this.dialogRef.close();
    }
}