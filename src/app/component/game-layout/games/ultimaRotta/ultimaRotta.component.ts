import { ChangeDetectorRef, Component, OnInit, } from '@angular/core';
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

export class UltimaRottaComponent implements OnInit {
  public gameName = '';
  public gameConfig: GameConfig = {} as GameConfig;

  showSiteMap = true;
  timerDisplay: string = '00:05';
  timerDisplayDefault: string = '00:05';
  private timeDefualt: number = 5; // 30 minuti in secondi
  private timeRemaining: number = 5; // 30 minuti in secondi

  solarDeathTestValue:number = 0;
  counterPermanentDeathOfSun: number = 0;

  isDarkIconVisible = false;
  deviceType = '';

  private timerInterval: any;
  private isTimerRunning = false;

  constructor(
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private breakPointService: BreakpointService,
    private dialog: MatDialog
  ) { }

  async ngOnInit(): Promise<void> {
    this.gameName = this.route.snapshot.data['gameName'];
    if (!this.gameName) {
      throw new Error('route is not properly configured');
    }
    this.gameConfig = ultimeRottaConfig;
    this.deviceType = this.breakPointService.currentDeviceType;
    this.breakPointService.subscribeToBreakpointChanges().subscribe(
      (deviceType) => {
        this.deviceType = deviceType;
      });
  }

  isSmallDevice(): boolean {
    return this.breakPointService.isSmallDevice(this.deviceType);
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
    this.dialog.open(DeathSunComponent, {
      panelClass: 'death-sun-dialog',
      data: {
        solarDeathTestValue: this.solarDeathTestValue,
        counterPermanentDeathOfSun: this.counterPermanentDeathOfSun,
        showRollDice: showRollDice
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
      }
    })
  }

  // Formatta il tempo in formato mm:ss
  private updateTimerDisplay() {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    this.timerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  onToggleSiteMap(show: boolean) {
    this.showSiteMap = show;
    this.cdr.detectChanges();
  }
}
