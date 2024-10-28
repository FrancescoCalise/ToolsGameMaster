import { Component, OnInit, } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';
import { DynamicTableComponent } from '../../../dynamic-table/dynamic-table.component';
import { FeatureAreaComponent } from '../../feature-sitemap/feature-area.component';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-game-ultima-rotta',
  templateUrl: './ultimaRotta.component.html',
  styleUrl: './ultimaRotta.component.css',
  standalone: true,
  imports: [
    SharedModule,
    DynamicTableComponent,
    FeatureAreaComponent,
    RouterOutlet
  ],
  providers: [
    FeatureAreaComponent
  ]

})

export class UltimaRottaComponent implements OnInit{
  public gameName = 'Ultima-rotta';

  timerDisplay: string = '30:00';
  solarDeathTestValue = 0;
  isDarkIconVisible = true;

  private timeRemaining: number = 1800; // 30 minuti in secondi
  private timerInterval: any;
  private isTimerRunning = false;

  constructor(
    private toastService: ToastService,
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
