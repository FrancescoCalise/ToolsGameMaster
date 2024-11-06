import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';
import { DynamicTableComponent } from '../../../dynamic-table/dynamic-table.component';
import { FeatureAreaComponent } from '../../feature-sitemap/feature-area.component';
import { ToastService } from '../../../../services/toast.service';
import { GameConfig } from '../../../../interface/GameConfig';
import { ultimeRottaConfig } from './ultime-rotta-config';
import { BreakpointService } from '../../../../services/breakpoint.service';
import { MatDialog } from '@angular/material/dialog';
import { DeathSunComponent } from './features/death-sun/death-sun.component';
import { GameBaseComponent } from '../base/game-base.component';

export interface DeathOfSunInterface{
  deathSunBonus: number;
  remaingTime: number,
  displayTime: string,
  counterPermanentDeathOfSun: number
  isDarkIconVisible: boolean
}

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

export class UltimaRottaComponent extends GameBaseComponent implements OnInit,OnDestroy {
 
 
  timerDisplay: string = '30:00';
  timerDisplayDefault: string = '30:00';
  private timeDefualt: number = 1800; // 30 minuti in secondi
  private timeRemaining: number = 1800; // 30 minuti in secondi

  solarDeathTestValue:number = 0;
  counterPermanentDeathOfSun: number = 0;
  isDarkIconVisible = false;

  private timerInterval: any;
  private isTimerRunning = false;

  override async ngOnInit(): Promise<void> {
    this.gameConfig = ultimeRottaConfig;
    let init = this.cacheStorage.getItem(this.cacheStorage.sunOfDeathKey) as DeathOfSunInterface;
    if(init){
      this.timerDisplay = init.displayTime;
      this.timeRemaining = init.remaingTime;
      this.solarDeathTestValue = init.deathSunBonus;
      this.isDarkIconVisible = init.isDarkIconVisible;
      this.counterPermanentDeathOfSun = init.counterPermanentDeathOfSun;
    }
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    this.saveData();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event): void {
    this.saveData();
  }

  saveData(){
    let data: DeathOfSunInterface = {
      displayTime: this.timerDisplay,
      remaingTime: this.timeRemaining,
      deathSunBonus: this.solarDeathTestValue,
      counterPermanentDeathOfSun: this.counterPermanentDeathOfSun,
      isDarkIconVisible: this.isDarkIconVisible
    }
    this.cacheStorage.setItem(this.cacheStorage.sunOfDeathKey,data)
  }
  // Funzione per avviare il timer
  handleTimer() {
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
          this.onTimerComplete(); // Chiamata al metodo quando il timer scade

        }
      }, 1000);
    }
  }

  onTimerComplete() {
    this.toastService.showInfo("Il timer è scaduto.");
    this.openDeathSunDialog(); // Apri il dialog alla scadenza del timer
    this.timeRemaining = this.timeDefualt; // Resetta il timer
    this.timerDisplay = this.timerDisplayDefault; // Resetta il display del timer
  }

  initDeathSun(){
    this.openDeathSunDialog(false);
  }

  openDeathSunDialog(showRollDice = true) {
    this.dialogService.open(DeathSunComponent, {
      panelClass: 'death-sun-dialog',
      data: {
        solarDeathTestValue: this.solarDeathTestValue,
        counterPermanentDeathOfSun: this.counterPermanentDeathOfSun,
        showRollDice: showRollDice,
        remaingTime: this.timeRemaining
      }
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.solarDeathTestValue = result.deathSunBonus as number;
        this.counterPermanentDeathOfSun = result.counterPermanentDeathOfSun as number;
        let resetCounter = result.resetCounter;
        if(this.solarDeathTestValue > 20) {
          this.isDarkIconVisible = true;
        }
        
        if(resetCounter){
          this.solarDeathTestValue = 0;
          this.counterPermanentDeathOfSun = 0;
        }

        if(result.remaingTime && this.timeRemaining !== result.remaingTime){
          this.timeRemaining = result.remaingTime;
          this.updateTimerDisplay();
        }
      }
    })
  }

  // Formatta il tempo in formato mm:ss
  private updateTimerDisplay() {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    this.timerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

}
