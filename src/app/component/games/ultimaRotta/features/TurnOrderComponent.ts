import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ordine-turni',
  template: `
    <h2>Ordine dei Turni</h2>
    <p>Gestisci qui l'ordine dei turni per i giocatori.</p>
    <button mat-button (click)="close()">Chiudi</button>
  `
})
export class TurnOrderComponent {
  constructor(private dialogRef: MatDialogRef<TurnOrderComponent>) {}

  close() {
    this.dialogRef.close();
  }
}
