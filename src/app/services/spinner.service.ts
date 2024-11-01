import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private isSpinnerVisible = false;
  public openBy = "";

  constructor(private ngxSpinner: NgxSpinnerService) {

  }

  // Mostra lo spinner
  show(nameMethod: string) {
    if(this.isSpinnerVisible){
      return;
    }

    this.isSpinnerVisible = true;
    this.openBy = nameMethod;
    console.log("Aperto da: " + nameMethod);
    this.ngxSpinner.show();
  }

  // Nasconde lo spinner
  hide(nameMethod: string) {
    if (this.isSpinnerVisible && this.openBy === nameMethod) {
      this.isSpinnerVisible = false;
      console.log("Chiuso da: " + nameMethod);
      this.openBy = "";
      this.ngxSpinner.hide();
    }
  }

}