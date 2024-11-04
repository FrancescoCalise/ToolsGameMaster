import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslationMessageService } from '../../../../../../services/translation-message-service';
import { SharedModule } from '../../../../../../shared/shared.module';
import { ToastService } from '../../../../../../services/toast.service';
import { SharedFields } from '../../../../../../shared/shared-fields.module';

@Component({
  selector: 'app-death-sun',
  templateUrl: './death-sun.component.html',
  styleUrls: ['./death-sun.component.css'],
  standalone: true,
  imports: [
    SharedModule,
    SharedFields
  ]
})

export class DeathSunComponent implements OnInit {
  title: string = '';
  deathSunBonus: number = 0;
  diceResult: number | null = null; // Risultato del dado, se lanciato
  smallDiceResult: number | null = null; // Risultato del dado a 6 facce per 20+
  selectedDeathSun: DeathSun | null = null; // Elemento selezionato in base al risultato del dado
  counterPermanentDeathOfSun: number = 0; // Nuovo contatore

  showRollDice:boolean = true;

  public tableDeathSun = [
    {
      result: "1-7",
      code: "IL_SOLE_RESISTE",
      bonus: +1
    },
    {
      result: "8-9",
      code: "ONDA_PLASMA_1",
      bonus: +1
    },
    {
      result: "10-11",
      code: "ONDA_PLASMA_2",
      bonus: +2
    },
    {
      result: "12-13",
      code: "ONDA_PLASMA_3",
      bonus: +3
    },
    {
      result: "14-16",
      code: "FREMITO_GRAVITAZIONALE",
      bonus: +2
    },
    {
      result: "17-18",
      code: "PULSAZIONE_ENERGIA_SOLARE",
      bonus: +2
    },
    {
      result: "19-20",
      code: "ESPLOSIONE_SOLARE",
      bonus: +1
    },
    {
      result: "21",
      code: "SOLE_SPENTO",
      bonus: 0
    }

  ] as DeathSun[];

  constructor(
    public dialogRef: MatDialogRef<DeathSunComponent>,
    private translationMessageService: TranslationMessageService,
    private toastService: ToastService,
    @Inject(MAT_DIALOG_DATA) public data: {
      solarDeathTestValue: number,
      counterPermanentDeathOfSun: number
      showRollDice: boolean
    }
  ) {

    this.deathSunBonus = data.solarDeathTestValue;
    this.counterPermanentDeathOfSun = data.counterPermanentDeathOfSun;
    this.showRollDice = data.showRollDice;
  }

  async ngOnInit(): Promise<void> {
    this.title = await this.translationMessageService.translate('ULTIMA_ROTTA.DEATH_SUN.TITLE');

    this.tableDeathSun.forEach(async element => {
      element.description = await this.translationMessageService.translate('ULTIMA_ROTTA.DEATH_SUN.' + element.code);
    });
  }

  closeDialog() {
    this.dialogRef.close(
      { 
        deathSunBonus: this.deathSunBonus, 
        counterPermanentDeathOfSun: this.counterPermanentDeathOfSun 
      });
  }

 

  async rollDice() {
    this.diceResult = Math.floor(Math.random() * 12) + 1; // Simula un lancio di dado a 6 facce
    let result = this.diceResult + this.deathSunBonus;
    let message = await this.translationMessageService.translate('ULTIMA_ROTTA.DEATH_SUN.DICE_RESULT', { result });

    this.toastService.showSuccess(message, undefined, 5000);

    this.selectedDeathSun = this.findDeathSun(result);
    this.deathSunBonus += this.selectedDeathSun?.bonus || 0;
  }

  // Trova l'elemento corrispondente in base al risultato del dado
  findDeathSun(diceValue: number): DeathSun | null {
    for (const entry of this.tableDeathSun) {
      const [min, max] = entry.result.split('-').map(Number);
      if (max ? diceValue >= min && diceValue <= max : diceValue === min) {
        return entry;
      }
    }
    return null;
  }

  async rollSmallDice() {
    this.smallDiceResult = Math.floor(Math.random() * 6) + 1;
    let result = this.smallDiceResult;
    let message = await this.translationMessageService.translate('ULTIMA_ROTTA.DEATH_SUN.DICE_RESULT', { result });

    this.toastService.showSuccess(message, undefined, 5000);

    if (this.smallDiceResult === 1) {
      this.counterPermanentDeathOfSun++;
    } else if (this.smallDiceResult === 6) {
      this.counterPermanentDeathOfSun = 0;
      this.deathSunBonus = 0;
    }
  }
}


export interface DeathSun {
  result: string;
  code: string;
  description?: string;
  bonus: number;
}