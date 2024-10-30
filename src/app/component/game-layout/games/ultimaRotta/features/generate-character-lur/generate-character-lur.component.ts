import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../../../shared/shared.module';
import { Ability, CharacterSheetLUR, Genetic, Role } from './charachter-sheet-lur';
import { TranslationMessageService } from '../../../../../../services/translation-message-service';
import { NgForm } from '@angular/forms';
import { FirestoreService } from '../../../../../../services/firestore.service';
import { CHARECTER_SHEET_LUR, } from '../../../../../../firebase-provider';
import { QueryFieldFilterConstraint, where } from 'firebase/firestore';
import { SessionManager } from '../../../../../../interface/Document/SessionManager';
import { CacheStorageService } from '../../../../../../services/cache-storage.service';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../../../../../../services/spinner.service';
import * as bootstrap from 'bootstrap';
import { SessionManagerWidgetComponent } from '../../../../../session-manager-widget/session-manager-widget.component';
import { UtilitiesCreateCharacterLur } from './utilities-create-character-lur/utilities-create-character-lur';
import { RandomNameService } from '../../../../../../services/randomNameService';

@Component({
  selector: 'app-generate-character-lur',
  templateUrl: './generate-character-lur.component.html',
  styleUrls: ['./generate-character-lur.component.css'],
  standalone: true,
  imports: [
    SharedModule,
    SessionManagerWidgetComponent,
  ],
})
export class GenerateCharacterLurComponent implements OnInit {
  sessionLoaded = false;
  defaultSession: SessionManager = {};
  gameName = '';

  readonly rolesDefaultData = UtilitiesCreateCharacterLur.rolesDefaultData;
  readonly geneticDefaultData = UtilitiesCreateCharacterLur.geneticDefaultData;
  readonly attributeKeys = UtilitiesCreateCharacterLur.attributeKeys;

  characters: CharacterSheetLUR[] = [];
  showForm = false;
  character: CharacterSheetLUR = {
    genetic: {} as Genetic,
    attributes: []
  };

  selectedGenes: string[] = ['', '', '']
  selectedAbilities: Ability[] = [];

  @ViewChild('characterForm') characterForm!: NgForm;
  @ViewChild('characterModal') characterModal!: ElementRef<HTMLDivElement>;

  constructor(private translationMessageService: TranslationMessageService,
    @Inject(CHARECTER_SHEET_LUR) private firestoreLurSheetService: FirestoreService<CharacterSheetLUR>,
    private cacheService: CacheStorageService,
    private route: ActivatedRoute,
    private spineerService: SpinnerService,
    private randomNameService: RandomNameService) 
  {
    firestoreLurSheetService.setCollectionName('character-sheet-lur');
  }

  onSessionLoaded(loadedSession: SessionManager) {
    this.defaultSession = loadedSession;
    this.sessionLoaded = true;
    this.ngOnInit();
  }

  async ngOnInit() {
    this.spineerService.showSpinner();

    await this.setDescriptionsLanguages();
    await this.loadCharacters();

    this.character = UtilitiesCreateCharacterLur.initCharacter(this.defaultSession?.id); //Sempre dopo le traduzioni
    this.spineerService.hideSpinner();
  }

  async loadCharacters(): Promise<void> {
    if (!this.defaultSession) return;
    let sessionId = this.defaultSession?.id;
    let whereConditions: QueryFieldFilterConstraint[] = [];
    whereConditions.push(where('sessionId', '==', sessionId));
    this.characters = await this.firestoreLurSheetService.getItemsWhere(whereConditions);

  }

  async setDescriptionsLanguages(): Promise<void> {
    for (const role of UtilitiesCreateCharacterLur.rolesDefaultData) {
      role.description = await this.translationMessageService.translate('ULTIMA_ROTTA.ROLE.' + role.code);
      if (role.abilities) {
        for (const ability of role.abilities) {
          ability.description = await this.translationMessageService.translate('ULTIMA_ROTTA.ABILITY.' + ability.code);
        }
      }
    }

    for (const g of UtilitiesCreateCharacterLur.geneticDefaultData) {
      g.description = await this.translationMessageService.translate('ULTIMA_ROTTA.GENETIC.' + g.code);
    }

    for (const attribute of UtilitiesCreateCharacterLur.attributeKeys) {
      attribute.description = await this.translationMessageService.translate('ULTIMA_ROTTA.ATTRIBUTES.' + attribute.code);
    }
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (this.showForm) {
      const modalElement = this.characterModal.nativeElement;
      const bootstrapModal = new bootstrap.Modal(modalElement);
      bootstrapModal.show();
    } else {
      const modalElement = this.characterModal.nativeElement;
      const bootstrapModal = bootstrap.Modal.getInstance(modalElement);
      bootstrapModal?.hide();
    }
  }

  async saveCharacter(): Promise<void> {
    let newCharacter = this.character as CharacterSheetLUR;

    if (newCharacter.id) {
      const index = this.characters.findIndex(char => char.id === newCharacter.id);
      if (index !== -1) this.characters[index] = newCharacter;
    } else {
      var id = await this.firestoreLurSheetService.addItem(newCharacter);
      newCharacter.id = id;
      this.characters.push(newCharacter);
    }
    this.resetForm();

  }

  editCharacter(character: CharacterSheetLUR) {
    this.character = character;
    this.toggleForm();
  }

  async deleteCharacter(character: CharacterSheetLUR): Promise<void> {
    if (character.id !== undefined) {
      await this.firestoreLurSheetService.deleteItem(character.id);
      this.characters = this.characters.filter(char => char.id !== character.id);
    }
  }

  updateAttribute(code: string, key: 'value' | 'bonus', value: number) {
    if (this.character && this.character.attributes) {
      const attribute = this.character.attributes.find(attr => attr.code === code);
      if (attribute) {
        attribute[key] = Math.floor(value); // Ensures only integers are saved
      }
    }
  }

  toggleAbilitySelection(ability: Ability) {
    if (this.character.role && this.character.role.abilities) {
      const index = this.character.role.abilities.findIndex(a => a.code === ability.code);
      if (index === -1) {
        // Add ability if not already selected
        this.character.role.abilities = [...this.character.role.abilities, ability];
      } else {
        // Remove ability if already selected
        this.character.role.abilities = this.character.role.abilities.filter(a => a.code !== ability.code);
      }
    }
  }

  isAbilitySelected(ability: Ability): boolean {
    if (this.character.role && this.character.role.abilities) {
      return this.character.role?.abilities.some(a => a.code === ability.code) || false;
    }
    return false;
  }

  getAbilityOption(roleId: string): Ability[] {
    const role = UtilitiesCreateCharacterLur.rolesDefaultData.find(r => r.code === roleId);
    return role ? role.abilities as Ability[] : [];
  }

  getDefaultGenes(geneticId: string): string[] {
    const genetic = UtilitiesCreateCharacterLur.geneticDefaultData.find(r => r.code === geneticId);
    return genetic ? genetic.genes as string[] : [];
  }

  roleSelected(role: Role) {
    if (role) {
      return UtilitiesCreateCharacterLur.rolesDefaultData.find(r => r.code === role.code);
    } return undefined;
  }

  onChangeRole(selectedRole: Role | undefined) {
    if (selectedRole) {
      this.character.role = { ...selectedRole, abilities: [] };
      this.selectedAbilities = [];
    } else {
      this.character.role = undefined;
      this.selectedAbilities = [];
    }
  }

  onChangeGenetic(selectedGenetic: Genetic | undefined) {
    if (selectedGenetic) {
      this.character.genetic = { ...selectedGenetic, genes: [] };
      this.selectedGenes = [];
    } else {
      this.character.role = undefined;
      this.selectedGenes = [];
    }
  }

  currentGeneticHaveGenes(): boolean {
    let currentGenetic = UtilitiesCreateCharacterLur.geneticDefaultData.find(g => g.code === this.character.genetic?.code);
    if (currentGenetic && currentGenetic.genes) {
      return currentGenetic.genes.length > 0;
    }
    return false;
  }

  onSelectGenes(genes: string, index: number) {
    this.selectedGenes[index] = genes;
    if (this.character.genetic) {
      this.character.genetic.genes = this.selectedGenes;
    }
  }

  compareById<T extends { id?: any }>(obj1: T, obj2: T): boolean {
    return obj1 && obj2 ? obj1.id === obj2.id : obj1 === obj2;
  }

  private resetForm() {
    this.character = UtilitiesCreateCharacterLur.initCharacter(this.defaultSession?.id);
    if (this.characterForm) this.characterForm.resetForm();
    this.toggleForm();
  }

  async generateRandom() {
    let newChar = UtilitiesCreateCharacterLur.initCharacter(this.defaultSession?.id);
    
    newChar = await UtilitiesCreateCharacterLur.generateRandomCharacter(newChar, this.randomNameService);
    console.log(newChar);
  }

  printRandom() {

  }
}
