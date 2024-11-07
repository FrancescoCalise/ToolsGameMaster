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
import { CharacterDialogDND5eComponent } from './character-dialog-form/character-dialog-dnd5e.component';
import { PdfService } from '../../../../../../services/pdf.service';
import { SharedFields } from '../../../../../../shared/shared-fields.module';
import { CharacterSheetDND5ETemplate, initializeCharacterSheet } from './charachter-sheet-dnd5e';
import { UtilitiesCreateCharacterDND5 } from './utilities-create-character-dnd5e/utilities-create-character-dnd5e';
import { FormField, DialogAiGeneration, StepperData } from '../../../../feature-sitemap/dialog-ai-generation/dialog-ai-generation.component';
import { firstValueFrom } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from '../../../../../../services/dialog.sevice';
import { dnd5eConfig } from '../../dnd-5e-config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generate-character-dnd5e',
  templateUrl: './generate-character-dnd5e.component.html',
  styleUrls: ['./generate-character-dnd5e.component.css'],
  standalone: true,
  imports: [
    SharedModule,
    SharedFields,
    SessionManagerWidgetComponent,
  ],
})
export class GenerateCharacterDND5EComponent implements OnInit, OnDestroy {
  readonly pathTemplateFIle = UtilitiesCreateCharacterDND5.pathTemplateFIle.replace('{0}', this.translationMessageService.getLanguage());
  sessionLoaded = false;
  defaultSession: SessionManager | undefined = undefined;
  characters: CharacterSheetDND5ETemplate[] = [];
  aiPrompt_1: string = 'Generami un PG per D&D 5e. Vorrei fosse {Name} un {Race} {Class} di livello {Level}.\n';
  public configGame = dnd5eConfig;

  constructor(private translationMessageService: TranslationMessageService,
    @Inject(CHARECTER_SHEET_LUR) private firestoreLurSheetService: FirestoreService<CharacterSheetDND5ETemplate>,
    private spinnerService: SpinnerService,
    private dialog: MatDialog,
    private pdfService: PdfService,
    private dialogService: DialogService,
    private router: Router) {
    firestoreLurSheetService.setCollectionName('character-sheet-dnd5e');
  }

  ngOnDestroy(): void {
    this.defaultSession = undefined;
  }

  async ngOnInit() {
    alert("This feature is not completed");
    this.router.navigate(['/games/dungeon-and-dragons-5e/SESSION_MANAGER']);
    this.spinnerService.show("GenerateCharacterLurComponent.ngOnInit");
    await this.loadCharacters();
    this.spinnerService.hide("GenerateCharacterLurComponent.ngOnInit");
  }

  openCharacterDialog(character?: CharacterSheetDND5ETemplate) {
    const dialogRef = this.dialogService.open(CharacterDialogDND5eComponent, {
      data: {
        character: character ? { ...character } : undefined,
        sessionId: this.defaultSession?.id,
      }
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

  async onSessionLoaded(loadedSession: SessionManager): Promise<void> {
    this.defaultSession = loadedSession;
    this.sessionLoaded = true;
    await this.loadCharacters();
  }

  async loadCharacters(): Promise<void> {
    if (!this.defaultSession) return;
    let sessionId = this.defaultSession?.id;
    let whereConditions: QueryFieldFilterConstraint[] = [];
    whereConditions.push(where('sessionId', '==', sessionId));
    this.characters = await this.firestoreLurSheetService.getItemsWhere(whereConditions);
  }

  async addRandomCharacter() {
    let pg = await this.openSteperCreationPG();
    if (pg) {
      this.addCharacter(pg);
    }
  }

  async printRandomCharacter() {
    let pg = await this.openSteperCreationPG();
    if (pg) {
      this.printPDF(pg);
    }
  }

  async printPDF(character: CharacterSheetDND5ETemplate) {
    await this.pdfService.loadPdf(this.pathTemplateFIle);
    const fields = await this.pdfService.getAllFields();

    this.pdfService.updateFieldsFromJson(character, fields);
    let pdf = await this.pdfService.getPDFUpdated();
    let fileName = `${character.CharacterName}_${character.Class}_${character.Race}.pdf`;
    this.pdfService.downloadPdf(pdf, fileName);
  }

  async openSteperCreationPG(): Promise<CharacterSheetDND5ETemplate | undefined> {
    let formBuilder = new FormGroup({
      Name: new FormControl(''),
      Class: new FormControl(''),
      Race: new FormControl(''),
      Level: new FormControl('', [Validators.min(1), Validators.max(20)]),
    });

    let labelLevel = await this.translationMessageService.translate('DUNGEON_AND_DRAGONS_5E.SHEET.LEVEL')
    let labelName = await this.translationMessageService.translate('DUNGEON_AND_DRAGONS_5E.SHEET.NAME')
    let labelClass = await this.translationMessageService.translate('DUNGEON_AND_DRAGONS_5E.SHEET.CLASS')
    let labelRace = await this.translationMessageService.translate('DUNGEON_AND_DRAGONS_5E.SHEET.RACE')

    let formFields: FormField[] = [
      { label: labelName, controlName: 'Name', type: 'text' },
      { label: labelRace, controlName: 'Race', type: 'text' },
      { label: labelClass, controlName: 'Class', type: 'text' },
      { label: labelLevel, controlName: 'Level', type: 'number' },
    ];

    let newPG = initializeCharacterSheet();

    let stepperData: StepperData = {
      template: newPG,
      prompt_1: this.aiPrompt_1,
      formGroup: formBuilder,
      formFields: formFields
    }
    const dialogRef = this.dialogService.open(DialogAiGeneration, {
      data: stepperData,
    });

    try {
      const result = await firstValueFrom(dialogRef.afterClosed());

      if (result && JSON.parse(result) as CharacterSheetDND5ETemplate) {
        return JSON.parse(result) as CharacterSheetDND5ETemplate;
      } else if (result) {
        throw new Error("Error in the creation of the character");
      }
      return;
    } catch (error) {
      console.error(error);
      throw new Error("Dialog closed without a result or error in character creation.");
    }
  }
}


