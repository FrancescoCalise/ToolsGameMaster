import { Component, EventEmitter, Input, Output } from "@angular/core";
import { SharedModule } from "../../../../shared/shared.module";

@Component({
    selector: 'app-field-button',
    templateUrl: './field-button.component.html',
    styleUrls: ['./field-button.component.css'],
    standalone: true,
    imports: [
        SharedModule
    ]
})
export class FieldButtonComponent {
    @Input() colorClass: string = ''; // Classe di colore in input
    @Input() icon: string = ''; // Nome dell'icona in input
    @Output() buttonClick = new EventEmitter<void>(); // Evento di click

    onClick() {
        this.buttonClick.emit(); // Emetti l'evento quando viene cliccato
      }
}