import { Component, Output, EventEmitter, ViewChild, ElementRef, Input, OnInit } from "@angular/core";
import { SharedModule } from "../../../../shared/shared.module";
import { TranslationMessageService } from "../../../../services/translation-message-service";

@Component({
    selector: 'fields-image-uploader',
    templateUrl: './fields-image-uploader.component.html',
    styleUrls: ['./fields-image-uploader.component.css'],
    standalone: true,
    imports: [
        SharedModule
    ]
})
export class ImageUploaderComponent  {
    
    @Output() imageChange = new EventEmitter<string | ArrayBuffer | null>();
    @ViewChild('fileInput') fileInput!: ElementRef;

    private _maxWidth: string = '100%';
    private _minWidth: string = '100%';
    private _maxHeight: string = '100%'; // Valore di default per max-height

    @Input()
    set maxWidth(value: string) {
        this._maxWidth = value.includes('px') || value.includes('%') ? value : `${value}px`;
    }

    get maxWidth(): string {
        return this._maxWidth;
    }

    @Input()
    set minWidth(value: string) {
        this._minWidth = value.includes('px') || value.includes('%') ? value : `${value}px`;
    }

    get minWidth(): string {
        return this._minWidth;
    }

    @Input()
    set maxHeight(value: string) {
        this._maxHeight = value.includes('px') || value.includes('%') ? value : `${value}px`;
    }

    get maxHeight(): string {
        return this._maxHeight;
    }

    imageSrc: string | ArrayBuffer | null = null;

    constructor(private translationMessageService: TranslationMessageService) { 

    }
    
    triggerFileInput(): void {
        this.fileInput.nativeElement.click();
    }

    onImageSelected(event: Event): void {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                this.imageSrc = reader.result;
                this.imageChange.emit(this.imageSrc);
            };
            reader.readAsDataURL(file);
        }
    }

    removeImage(event: Event): void {
        event.stopPropagation();
        this.imageSrc = null;
        this.fileInput.nativeElement.value = ''; // Resetta l'input file
        this.imageChange.emit(null); // Emette il cambiamento per l’immagine
    }
}