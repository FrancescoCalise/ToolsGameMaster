import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private isSpinnerVisible = false;

  constructor(private ngxSpinner: NgxSpinnerService) {

  }

  // Mostra lo spinner
  showSpinner() {
    this.isSpinnerVisible = true;
    this.ngxSpinner.show();
  }

  // Nasconde lo spinner
  hideSpinner() {
    if (this.isSpinnerVisible) {
      this.isSpinnerVisible = false;
      this.ngxSpinner.hide();
    }
  }

}