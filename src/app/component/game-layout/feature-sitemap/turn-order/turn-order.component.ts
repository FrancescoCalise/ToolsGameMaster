import { Component, ElementRef, ViewChild, Input, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SharedModule } from '../../../../shared/shared.module';
import { SharedFields } from '../../../../shared/shared-fields.module';
import { CacheStorageService } from '../../../../services/cache-storage.service';
import { DynamicWrapperModalComponent } from '../../../framework/modal/dynamic-wrapper-modal.component';

interface Character {
  name: string;
  initiative: number;
  health: number;
}

@Component({
  selector: 'app-turn-order',
  templateUrl: './turn-order.component.html',
  styleUrls: ['./turn-order.component.css'],
  standalone: true,
  imports: [SharedModule, SharedFields, DynamicWrapperModalComponent]
})
export class TurnOrderComponent implements OnInit, OnDestroy {
  characters: Character[] = [];
  dataSource = new MatTableDataSource(this.characters);
  displayedColumns: string[] = ['initiative','name','health', 'actions'];

  @ViewChild('characterName') characterName!: ElementRef<HTMLInputElement>;
  @ViewChild('characterInitiative') characterInitiative!: ElementRef<HTMLInputElement>;
  @ViewChild('characterHealth') characterHealth!: ElementRef<HTMLInputElement>;

  constructor(
    private dialogRef: MatDialogRef<TurnOrderComponent>,
    private cacheStorageService: CacheStorageService
  ) {}

  ngOnInit(): void {
    const charactersCached = this.cacheStorageService.getItem(this.cacheStorageService.turnOrderKey);
    this.characters = charactersCached ? charactersCached : [];
    if (this.characters.length > 0) {
      this.dataSource.data = [...this.characters];
    }
  }

  ngOnDestroy(): void {
    this.cacheStorageService.setItem(this.cacheStorageService.turnOrderKey, this.characters);
  }

  addCharacter(name: string, initiative: number, health: number): void {
    name = name.trim();
    initiative = initiative || 0;
    health = health || 0;

    if (name) {
      this.characters.push({ name, initiative, health });
      this.sortCharacters(); // Sort after adding a character
      this.dataSource.data = [...this.characters]; // Update the data source

      // Clear inputs after adding the character
      this.characterName.nativeElement.value = '';
      this.characterInitiative.nativeElement.value = '';
      this.characterHealth.nativeElement.value = '';
      this.characterName.nativeElement.focus(); // Focus back on name input
    }
  }

  removeCharacter(character: Character): void {
    const index = this.characters.indexOf(character);
    if (index >= 0) {
      this.characters.splice(index, 1);
      this.dataSource.data = [...this.characters]; // Update the data source
    }
  }

  sortCharacters(): void {
    this.characters.sort((a, b) => b.initiative - a.initiative);
    this.dataSource.data = [...this.characters]; // Update the data source to reflect changes
  }

  close(): void {
    this.dialogRef.close();
  }
}