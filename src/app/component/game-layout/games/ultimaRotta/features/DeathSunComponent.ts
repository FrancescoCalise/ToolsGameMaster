import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-death-sun',
  template: `
    <h2 mat-dialog-title>{{ data.message }}</h2>
    <div mat-dialog-actions>
      <button mat-button (click)="close()">OK</button>
    </div>
  `
})
export class DeathSunComponent {
  constructor(
    public dialogRef: MatDialogRef<DeathSunComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  close() {
    this.dialogRef.close();
  }
}
