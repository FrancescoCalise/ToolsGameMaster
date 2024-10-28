import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FeatureConfig } from '../../../interface/FeatureConfig';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TurnOrderComponent } from './features/TurnOrderComponent';
import { TranslationMessageService } from '../../../services/translation-message-service';
import { DeathSunComponent } from './features/DeathSunComponent';
import { ToastService } from '../../../services/toast.service';
import { CacheStorageService } from '../../../services/cache-storage.service';
import { ultimaRottaTable } from './ultima-rotta-table';
import { DynamicTableComponent } from '../../dynamic-table/dynamic-table.component';

@Component({
  selector: 'app-game-ultima-rotta',
  templateUrl: './ultimaRotta.component.html',
  styleUrl: './ultimaRotta.component.css',
  standalone: true,
  imports: [
    SharedModule,
    DynamicTableComponent
  ],

})

export class UltimaRottaComponent implements OnInit {

  timerDisplay: string = '30:00';
  solarDeathTestValue = 0;
  isDarkIconVisible = true;

  ultimaRottaTableData = ultimaRottaTable;

  private timeRemaining: number = 1800; // 30 minuti in secondi
  private timerInterval: any;
  private isTimerRunning = false;

  constructor(
    private dialog: MatDialog,
    private translationMessageService: TranslationMessageService,
    private toastService: ToastService,
    private cacheStorageService : CacheStorageService
  ) { }

  async ngOnInit(): Promise<void> {
   
  }




  // Funzione per avviare il timer
  startTimer() {
    if (this.isTimerRunning) {
      // Se il timer è in esecuzione, fermalo
      clearInterval(this.timerInterval);
      this.isTimerRunning = false;
      this.toastService.showInfo("Timer fermato");
    } else {
      // Se il timer non è in esecuzione, avvialo
      this.isTimerRunning = true;
      this.toastService.showInfo("Timer avviato");

      this.timerInterval = setInterval(() => {
        if (this.timeRemaining > 0) {
          this.timeRemaining--;
          this.updateTimerDisplay();
        } else {
          clearInterval(this.timerInterval);
          this.isTimerRunning = false;
        }
      }, 1000);
    }
  }

  // Formatta il tempo in formato mm:ss
  private updateTimerDisplay() {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    this.timerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

}
