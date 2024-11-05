import { Component, Inject, OnDestroy, OnInit, } from '@angular/core';
import { SharedModule } from '../../../../../../shared/shared.module';
import { CharacterSheetLURTemplate } from './charachter-sheet-lur';
import { TranslationMessageService } from '../../../../../../services/translation-message-service';
import { FirestoreService } from '../../../../../../services/firestore.service';
import { CHARECTER_SHEET_LUR, } from '../../../../../../firebase-provider';
import { QueryFieldFilterConstraint, where } from 'firebase/firestore';
import { SessionManager } from '../../../../../../interface/Document/SessionManager';
import { SpinnerService } from '../../../../../../services/spinner.service';
import { SessionManagerWidgetComponent } from '../../../../../session-manager-widget/session-manager-widget.component';
import { fieldMapPDFLUR, UtilitiesCreateCharacterLur } from './utilities-create-character-lur/utilities-create-character-lur';
import { RandomNameService } from '../../../../../../services/randomNameService';
import { MatDialog } from '@angular/material/dialog';
import { CharacterDialogComponent } from './character-dialog-form/character-dialog.component';
import { PdfService } from '../../../../../../services/pdf.service';
import { SharedFields } from '../../../../../../shared/shared-fields.module';

@Component({
  selector: 'app-generate-character-lur',
  templateUrl: './generate-character-lur.component.html',
  styleUrls: ['./generate-character-lur.component.css'],
  standalone: true,
  imports: [
    SharedModule,
    SharedFields,
    SessionManagerWidgetComponent,
  ],
})
export class GenerateCharacterLurComponent implements OnInit, OnDestroy {
  readonly rolesDefaultData = UtilitiesCreateCharacterLur.rolesDefaultData;
  readonly geneticDefaultData = UtilitiesCreateCharacterLur.geneticDefaultData;
  readonly attributeKeys = UtilitiesCreateCharacterLur.attributeKeys;
  readonly traits = UtilitiesCreateCharacterLur.traitsDefaultData;
  readonly armorDetails = UtilitiesCreateCharacterLur.armorDetails;
  readonly pathTemplateFIle = UtilitiesCreateCharacterLur.pathTemplateFIle.replace('{0}', this.translationMessageService.getLanguage());

  sessionLoaded = false;
  defaultSession: SessionManager | undefined = undefined;
  characters: CharacterSheetLURTemplate[] = [];

  constructor(private translationMessageService: TranslationMessageService,
    @Inject(CHARECTER_SHEET_LUR) private firestoreLurSheetService: FirestoreService<CharacterSheetLURTemplate>,
    private spinnerService: SpinnerService,
    private randomNameService: RandomNameService,
    private dialog: MatDialog,
    private pdfService: PdfService,
  ) {
    firestoreLurSheetService.setCollectionName('character-sheet-lur');
  }

  ngOnDestroy(): void {
    this.defaultSession = undefined;
  }

  async ngOnInit() {
    this.spinnerService.show("GenerateCharacterLurComponent.ngOnInit");
    await this.loadCharacters();
    this.spinnerService.hide("GenerateCharacterLurComponent.ngOnInit");
  }

  openCharacterDialog(character?: CharacterSheetLURTemplate) {
    const isMobile = window.innerWidth < 768;
    const dialogRef = this.dialog.open(CharacterDialogComponent, {
      width: isMobile ? '100%' : '80%',
      height: isMobile ? '100%' : '90%',
      minHeight: '90%',
      data: {
        character: character ? { ...character } : undefined,
        sessionId: this.defaultSession?.id,
      },
    });

    dialogRef.afterClosed().subscribe((result: CharacterSheetLURTemplate | undefined) => {
      if (result) {
        character ? this.updateCharacter(result) : this.addCharacter(result);
      }
    });
  }

  addCharacter(newCharacter: CharacterSheetLURTemplate) {
    newCharacter.sessionId = this.defaultSession?.id;
    this.firestoreLurSheetService.addItem(newCharacter).then((id) => {
      newCharacter.id = id;
      this.characters.push(newCharacter);
    });
  }

  deleteCharacter(character: CharacterSheetLURTemplate) {
    this.firestoreLurSheetService.deleteItem(character.id as string).then(() => {
      const index = this.characters.findIndex((char) => char.id === character.id);
      if (index !== -1) this.characters.splice(index, 1);
    });
  }

  updateCharacter(updatedCharacter: CharacterSheetLURTemplate) {
    const index = this.characters.findIndex((char) => char.id === updatedCharacter.id);
    if (index !== -1) this.characters[index] = updatedCharacter;
  }

  onSessionLoaded(loadedSession: SessionManager) {
    this.defaultSession = loadedSession;
    this.sessionLoaded = true;
    this.ngOnInit();
  }

  async loadCharacters(): Promise<void> {
    if (!this.defaultSession) return;
    let sessionId = this.defaultSession?.id;
    let whereConditions: QueryFieldFilterConstraint[] = [];
    whereConditions.push(where('sessionId', '==', sessionId));
    this.characters = await this.firestoreLurSheetService.getItemsWhere(whereConditions);
  }


  async generateRandom(save: boolean): Promise<CharacterSheetLURTemplate> {

    this.spinnerService.show("GenerateCharacterLurComponent.generateRandom");
    const newChar = await UtilitiesCreateCharacterLur.generateRandomCharacter(this.randomNameService, this.translationMessageService);
    let newCharFree = await UtilitiesCreateCharacterLur.CovertToCharacterToFree(newChar, this.translationMessageService);

    if (newCharFree && save) {
      this.addCharacter(newCharFree);
    }
    this.spinnerService.hide("GenerateCharacterLurComponent.generateRandom");
    return newCharFree;
  }

  async printPDF(character?: CharacterSheetLURTemplate) {
    this.spinnerService.show("GenerateCharacterLurComponent.printRandom");
    let newChar = character ? character : await this.generateRandom(false);
    if (newChar) {
      await this.pdfService.loadPdf(this.pathTemplateFIle);
      this.pdfService.updateValues(newChar, fieldMapPDFLUR);
      let pdf = await this.pdfService.getPDFUpdated();
      let fileName = `${newChar.name}_${newChar.genetic_and_role}.pdf`;
      this.pdfService.downloadPdf(pdf, fileName);

      this.spinnerService.hide("GenerateCharacterLurComponent.printRandom");
    }
  }

}
