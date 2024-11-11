import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TableConfig } from '../../../interface/TableConfig';
import { TranslationMessageService } from '../../../services/translation-message-service';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css'],
  standalone: true,
  imports: [SharedModule],
})
export class DynamicTableComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() table!: TableConfig; // Tabella originale non tradotta (input)
  @Input() excludedColumnsToTranslate: string[] = []; // Colonne da escludere dalla traduzione
  @Output() isLoaded = new EventEmitter<string>();

  private originalTable!: TableConfig; // Copia della tabella originale per ricalcolare le traduzioni
  translatedTable!: TableConfig; // Tabella d'appoggio tradotta
  columnIds: string[] = []; // ID delle colonne originali
  translatedColumnHeaders: string[] = []; // Intestazioni tradotte delle colonne
  notesToShow: { symbol: string; description: string }[] = []; // Note tradotte

  private langSubscription!: Subscription;
  private defaultLang = '';

  constructor(
    private router: Router,
    private translationService: TranslationMessageService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    this.isCompleted();
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  async ngOnInit(): Promise<void> {
    if (!this.table) {
      this.router.navigate(['/']);
      throw new Error('TableConfig is null');
    }

    // Salviamo la tabella originale per ricalcolare le traduzioni
    this.originalTable = structuredClone(this.table);
    this.translatedTable = structuredClone(this.table);
    this.columnIds = [...this.table.columns];

    this.defaultLang = this.translationService.getLanguage();
    await this.applyTranslations();
    await this.generateNotes();
    //this.changeDetectorRef.detectChanges(); // Forza il rilevamento delle modifiche dopo la prima traduzione

    // Sottoscrizione al cambiamento di lingua
    this.langSubscription = this.translationService.onLanguageChange()
      .subscribe(async (newLang) => {
        if (this.defaultLang !== newLang) {


          this.translatedTable = {} as TableConfig;
          this.translatedColumnHeaders = [];
          this.notesToShow = [];

          this.defaultLang = newLang;

          this.translatedTable = structuredClone(this.originalTable);
          await this.applyTranslations();
          //await this.generateNotes();
         // this.changeDetectorRef.detectChanges(); // Forza il rilevamento delle modifiche
        }
      });
  }

  async applyTranslations() {
    // Traduzione delle intestazioni delle colonne, salvando quelle tradotte
    this.translatedColumnHeaders = await Promise.all(
      this.columnIds.map(async (columnId) => await this.translationService.translate(columnId))
    );

    // Traduzione dei valori nelle righe della tabella d'appoggio, escludendo le colonne specificate
    this.translatedTable.data = await Promise.all(
      this.translatedTable.data.map(async (row) => {
        const translatedRow: { [key: string]: string } = {};
        for (const key in row) {
          // Traduci solo se il valore non è vuoto e la colonna non è inclusa in `excludedColumnsToTranslate`
          translatedRow[key] = (!this.excludedColumnsToTranslate.includes(key) && row[key])
            ? await this.translationService.translate(row[key])
            : row[key];
        }
        return translatedRow;
      })
    );
  }

  async generateNotes(): Promise<void> {
    const notesMap = new Map<string, string>();
    this.translatedTable.notes?.forEach((note) => {
      if (note && note.symbol && !notesMap.has(note.symbol)) {
        notesMap.set(note.symbol, note.description);
      }
    });

    // Traduzione delle note e salvataggio in `notesToShow`
    this.notesToShow = await Promise.all(
      Array.from(notesMap, async ([symbol, description]) => ({
        symbol: symbol.includes('.') ? await this.translationService.translate(symbol) : symbol,
        description: await this.translationService.translate(description),
      }))
    );

    // Forza il rilevamento delle modifiche anche per le note
    this.changeDetectorRef.detectChanges();
  }

  isCompleted() {
    this.isLoaded.emit(this.table.id);
  }
}
