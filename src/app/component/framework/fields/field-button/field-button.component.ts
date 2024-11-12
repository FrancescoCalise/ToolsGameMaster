import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { SharedModule } from "../../../../shared/shared.module";

export interface ButtonConfig {
    colorClass: string;      // La classe CSS per il colore del pulsante
    icon: string;            // Il nome dell'icona
    tooltip: string;         // Il testo del tooltip o chiave di traduzione
    action?: EventEmitter<void> | (() => void); // L'evento da emettere al click del pulsante
    disabled: boolean;       // Se il pulsante è disabilitato
    isSystem: boolean;       // Indica se è un pulsante di sistema o meno
    label?: string;          // Il testo del pulsante
}


@Component({
    selector: 'app-field-button',
    templateUrl: './field-button.component.html',
    styleUrls: ['./field-button.component.css'],
    standalone: true,
    imports: [
        SharedModule
    ]
})
export class FieldButtonComponent implements OnInit {

    @Input() config!: ButtonConfig;

    @Input() colorClass: string = ''; // Classe di colore in input
    @Input() icon: string = ''; // Nome dell'icona in input
    @Input() label: string = ''; // Testo del pulsante in input
    @Input() tooltip: string = ''; // Tooltip in input
    @Input() isDisabled: boolean = false; // Disabilita il pulsante
    @Output() buttonClick = new EventEmitter<void>(); // Evento di click

    onClick() {
        if (!this.isDisabled) {
            this.buttonClick.emit(); // Emetti l'evento di click
        }
    }

    ngOnInit(): void {
        if (this.config) {
            this.colorClass = this.config.colorClass;
            this.icon = this.config.icon;
            this.label = this.config.label || '';
            this.tooltip = this.config.tooltip;
            this.isDisabled = this.config.disabled;

            // Check if `action` is an EventEmitter
            if (this.config.action instanceof EventEmitter) {
                this.buttonClick = this.config.action; // Directly assign the EventEmitter
            } else if (typeof this.config.action === 'function') {
                // Subscribe to `buttonClick` and call `config.action` if it's a function
                this.buttonClick.subscribe(() => (this.config.action as () => void)());
            }
        }
    }
}
