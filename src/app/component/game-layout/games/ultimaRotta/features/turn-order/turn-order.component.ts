import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../../../../../shared/shared.module';
import { SharedFields } from '../../../../../../shared/shared-fields.module';
import { MatTableDataSource } from '@angular/material/table';

interface Character {
  name: string;
  initiative: number;
}

@Component({
  selector: 'app-turn-order',
  templateUrl: './turn-order.component.html',
  styleUrls: ['./turn-order.component.css'],
  standalone: true,
  imports: [
    SharedModule,
    SharedFields
  ]
})
export class TurnOrderComponent {
  characters: Character[] = [];
  dataSource = new MatTableDataSource(this.characters);
  displayedColumns: string[] = ['name', 'initiative', 'actions'];

  constructor(private dialogRef: MatDialogRef<TurnOrderComponent>) {}

  close() {
    this.dialogRef.close();
  }

  addCharacter(name: string, initiative?: number): void {
    // If no initiative value is provided, roll a random initiative
    const initValue = initiative !== undefined ? initiative : this.rollInitiative();
    this.characters.push({ name, initiative: initValue });
    this.updateDataSource();
  }

  rollInitiative(): number {
    return Math.floor(Math.random() * 20) + 1;
  }

  rollInitiativeForCharacter(character: Character): void {
    character.initiative = this.rollInitiative();
    this.updateDataSource();
  }

  rollInitiativeForAll(): void {
    this.characters.forEach((character) => {
      character.initiative = this.rollInitiative();
    });
    this.updateDataSource();
  }

  private updateDataSource(): void {
    this.characters.sort((a, b) => b.initiative - a.initiative);
    this.dataSource.data = this.characters;
  }
}