import {  Component, Inject, OnInit, } from '@angular/core';
import { SharedModule } from '../../../../../../shared/shared.module';
import {  CharacterSheetLUR, Genetic } from './charachter-sheet-lur';
import { TranslationMessageService } from '../../../../../../services/translation-message-service';
import { FirestoreService } from '../../../../../../services/firestore.service';
import { CHARECTER_SHEET_LUR, } from '../../../../../../firebase-provider';
import { QueryFieldFilterConstraint, where } from 'firebase/firestore';
import { SessionManager } from '../../../../../../interface/Document/SessionManager';
import { SpinnerService } from '../../../../../../services/spinner.service';
import { SessionManagerWidgetComponent } from '../../../../../session-manager-widget/session-manager-widget.component';
import { UtilitiesCreateCharacterLur } from './utilities-create-character-lur/utilities-create-character-lur';
import { RandomNameService } from '../../../../../../services/randomNameService';
import { MatDialog } from '@angular/material/dialog';
import { CharacterDialogComponent } from './character-dialog-form/character-dialog.component';

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
  readonly rolesDefaultData = UtilitiesCreateCharacterLur.rolesDefaultData;
  readonly geneticDefaultData = UtilitiesCreateCharacterLur.geneticDefaultData;
  readonly attributeKeys = UtilitiesCreateCharacterLur.attributeKeys;
  readonly traits = UtilitiesCreateCharacterLur.traitsDefaultData;
  readonly armorDetails = UtilitiesCreateCharacterLur.armorDetails;

  translatedTraitMessage$ = this.translationMessageService.translate('ULTIMA_ROTTA.SHEET.SELECT_TRAITS');

  sessionLoaded = false;
  defaultSession: SessionManager = {};
  characters: CharacterSheetLUR[] = [];
  character: CharacterSheetLUR = { genetic: {} as Genetic, attributes: [] };

  constructor(private translationMessageService: TranslationMessageService,
    @Inject(CHARECTER_SHEET_LUR) private firestoreLurSheetService: FirestoreService<CharacterSheetLUR>,
    private spineerService: SpinnerService,
    private randomNameService: RandomNameService,
    private dialog: MatDialog
  ) {
    firestoreLurSheetService.setCollectionName('character-sheet-lur');
  }

  openCharacterDialog(character?: CharacterSheetLUR) {
    const isMobile = window.innerWidth < 768;
    const dialogRef = this.dialog.open(CharacterDialogComponent, {
      width: isMobile ? '100%' : '80%',
      height: isMobile ? '100%' : '50%',
      minHeight: '80%',
      data: {
        character: character ? { ...character } : UtilitiesCreateCharacterLur.initCharacter(this.defaultSession?.id),
        geneticDefaultData: UtilitiesCreateCharacterLur.geneticDefaultData,
        rolesDefaultData: UtilitiesCreateCharacterLur.rolesDefaultData,
      },
    });

    dialogRef.afterClosed().subscribe((result: CharacterSheetLUR | undefined) => {
      if (result) {
        character ? this.updateCharacter(result) : this.addCharacter(result);
      }
    });
  }

  addCharacter(newCharacter: CharacterSheetLUR) {
    this.firestoreLurSheetService.addItem(newCharacter).then((id) => {
      newCharacter.id = id;
      this.characters.push(newCharacter);
    });
  }

  deleteCharacter(character: CharacterSheetLUR) {
    this.firestoreLurSheetService.deleteItem(character.id as string).then(() => {
      const index = this.characters.findIndex((char) => char.id === character.id);
      if (index !== -1) this.characters.splice(index, 1);
    });
  }

  updateCharacter(updatedCharacter: CharacterSheetLUR) {
    const index = this.characters.findIndex((char) => char.id === updatedCharacter.id);
    if (index !== -1) this.characters[index] = updatedCharacter;
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
      if (g.abilities) {
        for (const ability of g.abilities) {
          ability.description = await this.translationMessageService.translate('ULTIMA_ROTTA.ABILITY.' + ability.code);
        }
      }
    }

    for (const attribute of UtilitiesCreateCharacterLur.attributeKeys) {
      attribute.description = await this.translationMessageService.translate('ULTIMA_ROTTA.ATTRIBUTES.' + attribute.code);
    }
    for (const trait of UtilitiesCreateCharacterLur.traitsDefaultData) {
      trait.description = await this.translationMessageService.translate('ULTIMA_ROTTA.TRAITS.' + trait.code);
    }

    if(this.armorDetails){
      let armor = this.armorDetails;

      if(armor.details){
        armor.details.forEach(async details => {
          details.description = await this.translationMessageService.translate('ULTIMA_ROTTA.ARMOR.' + details.code);
        });
      }
    }
  }

  async generateRandom() {
    let newChar = UtilitiesCreateCharacterLur.initCharacter(this.defaultSession?.id);

    this.spineerService.showSpinner();
    newChar = await UtilitiesCreateCharacterLur.generateRandomCharacter(newChar, this.randomNameService);
    if (newChar) {
      this.character = newChar;
      this.characters
      this.addCharacter(newChar);
    }

  }

  printRandom() {

  }
}
