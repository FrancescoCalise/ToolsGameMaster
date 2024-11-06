import { Component, ViewChild, ElementRef, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import html2canvas from "html2canvas";
import { PNG_5E } from "../../../interface/png_5e-interface";
import { SharedModule } from "../../../../../../../shared/shared.module";

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
        @Inject(MAT_DIALOG_DATA) public data: PNG_5E
    ) { }

    public downloadPNG(): void {
        html2canvas(this.pngCard.nativeElement).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `${this.data.name}.png`;
            link.click();
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

    public close(): void {
        this.dialogRef.close();
    }
}