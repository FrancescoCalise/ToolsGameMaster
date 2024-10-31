import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { CharacterSheetLUR } from './generate-character-lur/charachter-sheet-lur';
import { SharedModule } from '../../../../../shared/shared.module';

@Component({
  selector: 'app-character-dialog',
  templateUrl: './character-dialog.component.html',
  styleUrls: ['./character-dialog.component.css'],
  standalone: true,
  imports: [
    SharedModule
]
})
export class CharacterDialogComponent {
  character: CharacterSheetLUR;

  constructor(
    public dialogRef: MatDialogRef<CharacterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { character: CharacterSheetLUR }
  ) {
    this.character = data.character;
  }

  save(form: NgForm) {
    if (form.valid) {
      this.dialogRef.close(this.character);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
