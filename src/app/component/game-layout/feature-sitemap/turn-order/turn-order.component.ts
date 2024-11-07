import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../../../shared/shared.module';
import { SharedFields } from '../../../../shared/shared-fields.module';
import { CacheStorageService } from '../../../../services/cache-storage.service';
import { DynamicWrapperModalComponent } from '../../../framework/modal/dynamic-wrapper-modal.component';

interface Character {
  name: string;
  initiative: number;
  health: number;
  maxHealth: number;
  target:number;
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
  displayedColumns: string[] = ['initiative','name','health', 'actions'];

  @ViewChild('characterName') characterName!: ElementRef<HTMLInputElement>;
  @ViewChild('characterInitiative') characterInitiative!: ElementRef<HTMLInputElement>;
  @ViewChild('characterHealth') characterHealth!: ElementRef<HTMLInputElement>;
  @ViewChild('maxHealth') maxHealth!: ElementRef<HTMLInputElement>;
  @ViewChild('target') target!: ElementRef<HTMLInputElement>;

  constructor(
    private dialogRef: MatDialogRef<TurnOrderComponent>,
    private cacheStorageService: CacheStorageService
  ) {}

  ngOnInit(): void {
    const charactersCached = this.cacheStorageService.getItem(this.cacheStorageService.turnOrderKey);
    this.characters = charactersCached ? charactersCached : [];
    if (this.characters.length > 0) {
    }
  }

  ngOnDestroy(): void {
    this.cacheStorageService.setItem(this.cacheStorageService.turnOrderKey, this.characters);
  }

  addCharacter(name: string, initiative: number, health: number, maxHealth:number, target: number): void {
    name = name.trim();
    initiative = initiative || 0;
    health = health || 0;

    if (name) {
      this.characters.push({ name, initiative, health, maxHealth, target});
      this.sortCharacters(); // Sort after adding a character
      this.characters = [...this.characters]; // Update the data source

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
      this.characters = [...this.characters]; // Update the data source
    }
  }

  sortCharacters(): void {
    this.characters.sort((a, b) => b.initiative - a.initiative);
    this.characters = [...this.characters]; // Update the data source to reflect changes
  }

  close(): void {
    this.dialogRef.close();
  }
}