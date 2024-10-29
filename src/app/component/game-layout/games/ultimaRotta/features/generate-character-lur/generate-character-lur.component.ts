import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../../../shared/shared.module';
import { ToastService } from '../../../../../../services/toast.service';
import { CharacterAttribute, CharacterSheetLUR, Attribute, Role, Genetic } from './charachter-sheet-lur';
import { TranslationMessageService } from '../../../../../../services/translation-message-service';
import { attributeKeys, genetic, roles } from './data-sheet-lur';


@Component({
  selector: 'app-generate-character-lur',
  templateUrl: './generate-character-lur.component.html',
  styleUrls: ['./generate-character-lur.component.css'],
  standalone: true,
  imports: [
    SharedModule,
  ],
})
export class GenerateCharacterLurComponent implements OnInit {
  attributeKeys: Attribute[] = attributeKeys;

  attributeValues: { [key: string]: CharacterAttribute } = {};
  characters: CharacterSheetLUR[] = [];
  character: CharacterSheetLUR = this.initializeCharacter();
  showForm: boolean = false;

  roles = roles;
  genetic = genetic;

  constructor(private toastService: ToastService, private translationMessageService: TranslationMessageService) { }

  async ngOnInit(): Promise<void> {
    this.characters = this.getCharacters();
    this.initializeAttributeValues();
    await this.setDescriptionsLanguages();
  }

  async setDescriptionsLanguages() {
    this.roles.forEach(async role => {
      let codeIDML = 'ULTIMA_ROTTA.ROLE.' + role.code;
      role.description = await this.translationMessageService.translate(codeIDML);
      if (role.abilities) {
        role.abilities.forEach(async ability => {
          let codeIDML = 'ULTIMA_ROTTA.ABILITY.' + ability.code;
          ability.description = await this.translationMessageService.translate(codeIDML);
        });
      }
    });
    this.genetic.forEach(async genetic => {
      let codeIDML = 'ULTIMA_ROTTA.GENETIC.' + genetic.code;
      genetic.description = await this.translationMessageService.translate(codeIDML);
    });
    this.attributeKeys.forEach(async attribute => {
      let codeIDML = 'ULTIMA_ROTTA.ATTRIBUTES.' + attribute.code;
      attribute.description = await this.translationMessageService.translate(codeIDML);
    });
  }

  initializeAttributeValues(): void {
    this.attributeKeys.forEach(attribute => {
      this.attributeValues[attribute.code] = { value: 0, bonus: 0 };
    });
  }

  getCharacters(): CharacterSheetLUR[] {
    return []; // Replace with actual service call to fetch characters
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.character = this.initializeCharacter();
      this.initializeAttributeValues();
    }
  }

  initializeCharacter(): CharacterSheetLUR {
    const attributes: {
      agility: CharacterAttribute;
      courage: CharacterAttribute;
      strength: CharacterAttribute;
      intelligence: CharacterAttribute;
      magic: CharacterAttribute;
      manuality: CharacterAttribute;
      perception: CharacterAttribute;
      sociality: CharacterAttribute;
    } = {
      agility: { value: 0, bonus: 0 },
      courage: { value: 0, bonus: 0 },
      strength: { value: 0, bonus: 0 },
      intelligence: { value: 0, bonus: 0 },
      magic: { value: 0, bonus: 0 },
      manuality: { value: 0, bonus: 0 },
      perception: { value: 0, bonus: 0 },
      sociality: { value: 0, bonus: 0 },
    };

    return {
      name: '',
      attributes: attributes,
      maxMana: 0,
      maxLife: 0,
      armor: 0,
      ability: '',
      inventory: '',
      scrap: '',
      point_adventure: 0,
      background: '',
    };
  }

  saveCharacter(): void {
    if (this.character.name) {
      const existingCharacterIndex = this.characters.findIndex(char => char.name === this.character.name);
      if (existingCharacterIndex !== -1) {
        this.characters[existingCharacterIndex] = { ...this.character };
      } else {
        this.characters.push({ ...this.character });
      }
    }
    this.toggleForm();
  }

  editCharacter(character: CharacterSheetLUR): void {
    this.character = { ...character };

    if (character.attributes) {
      this.attributeKeys.forEach(attribute => {
        const key = attribute.code as keyof typeof character.attributes;
        this.attributeValues[attribute.code] = {
          value: character.attributes[key]?.value ?? 0,
          bonus: character.attributes[key]?.bonus ?? 0,
        };
      });
    } else {
      this.initializeAttributeValues();
    }

    this.showForm = true;
  }

  updateAttributeHelper(attributeCode: string, type: 'value' | 'bonus', value: number): void {
    this.updateAttribute(attributeCode as keyof CharacterSheetLUR['attributes'], type, value);
  }
  
  updateAttribute(attributeCode: keyof CharacterSheetLUR['attributes'], type: 'value' | 'bonus', value: number): void {
    this.attributeValues[attributeCode][type] = value;
    this.character.attributes[attributeCode][type] = value;
  }


  deleteCharacter(character: CharacterSheetLUR): void {
    this.characters = this.characters.filter(char => char !== character);
  }
}