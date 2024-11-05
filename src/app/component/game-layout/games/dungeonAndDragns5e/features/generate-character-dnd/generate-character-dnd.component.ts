import { Component, Inject, OnDestroy, OnInit, } from '@angular/core';
import { SharedModule } from '../../../../../../shared/shared.module';
import { TranslationMessageService } from '../../../../../../services/translation-message-service';
import { FirestoreService } from '../../../../../../services/firestore.service';
import { CHARECTER_SHEET_LUR, } from '../../../../../../firebase-provider';
import { QueryFieldFilterConstraint, where } from 'firebase/firestore';
import { SessionManager } from '../../../../../../interface/Document/SessionManager';
import { SpinnerService } from '../../../../../../services/spinner.service';
import { SessionManagerWidgetComponent } from '../../../../../session-manager-widget/session-manager-widget.component';
import { RandomNameService } from '../../../../../../services/randomNameService';
import { MatDialog } from '@angular/material/dialog';
import { CharacterDialogComponent } from './character-dialog-form/character-dialog.component';
import { PdfService } from '../../../../../../services/pdf.service';
import { SharedFields } from '../../../../../../shared/shared-fields.module';
import { CharacterSheetDND5ETemplate } from './charachter-sheet-dnd5e';
import { MethodNotImplementedError } from 'pdf-lib';

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
  

  sessionLoaded = false;
  defaultSession: SessionManager | undefined = undefined;
  characters: CharacterSheetDND5ETemplate[] = [];

  constructor(private translationMessageService: TranslationMessageService,
    @Inject(CHARECTER_SHEET_LUR) private firestoreLurSheetService: FirestoreService<CharacterSheetDND5ETemplate>,
    private spinnerService: SpinnerService,
    private randomNameService: RandomNameService,
    private dialog: MatDialog,
    private pdfService: PdfService,
  ) {
    firestoreLurSheetService.setCollectionName('character-sheet-dnd5e');
  }

  ngOnDestroy(): void {
    this.defaultSession = undefined;
  }

  async ngOnInit() {
    this.spinnerService.show("GenerateCharacterLurComponent.ngOnInit");
    await this.loadCharacters();
    this.spinnerService.hide("GenerateCharacterLurComponent.ngOnInit");
  }

  openCharacterDialog(character?: CharacterSheetDND5ETemplate) {
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

    dialogRef.afterClosed().subscribe((result: CharacterSheetDND5ETemplate | undefined) => {
      if (result) {
        character ? this.updateCharacter(result) : this.addCharacter(result);
      }
    });
  }

  addCharacter(newCharacter: CharacterSheetDND5ETemplate) {
    newCharacter.sessionId = this.defaultSession?.id;
    this.firestoreLurSheetService.addItem(newCharacter).then((id) => {
      newCharacter.id = id;
      this.characters.push(newCharacter);
    });
  }

  deleteCharacter(character: CharacterSheetDND5ETemplate) {
    this.firestoreLurSheetService.deleteItem(character.id as string).then(() => {
      const index = this.characters.findIndex((char) => char.id === character.id);
      if (index !== -1) this.characters.splice(index, 1);
    });
  }

  updateCharacter(updatedCharacter: CharacterSheetDND5ETemplate) {
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


  async generateRandom(save: boolean): Promise<CharacterSheetDND5ETemplate> {

    throw new MethodNotImplementedError("DND 5e", "generateRandom NON IMPLEMENTATO")
  }

  async printPDF(character?: CharacterSheetDND5ETemplate) {
    throw new MethodNotImplementedError("DND 5e", "printPDF NON IMPLEMENTATO")
  }

}
