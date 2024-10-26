import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  positionClassDefault = 'toast-bottom-center';
  durationDefault = 2000;

  constructor(private toastr: ToastrService) {}

  // Metodo per mostrare un toast di successo con durata opzionale
  showSuccess(message: string, title?: string, duration?: number, positionClass?: string) {

    const config: Partial<IndividualConfig> = {};
    config.timeOut = duration ? duration : this.durationDefault;
    config.positionClass = positionClass ? positionClass : this.positionClassDefault;

    let titleToast = title ? title : 'Success';

    this.toastr.success(message, titleToast, config);
  }

  // Metodo per mostrare un toast di errore con durata opzionale
  showError(message: string, title?: string, duration?: number, positionClass?: string) {
    const config: Partial<IndividualConfig> = {};
    config.timeOut = duration ? duration : this.durationDefault;
    config.positionClass = positionClass ? positionClass : this.positionClassDefault;
    let titleToast = title ? title : 'Error';

    this.toastr.error(message, titleToast, config);
  }

  // Metodo per mostrare un toast informativo con durata opzionale
  showInfo(message: string, title?: string, duration?: number, positionClass?: string) {
    const config: Partial<IndividualConfig> = {};
    config.timeOut = duration ? duration : this.durationDefault;
    config.positionClass = positionClass ? positionClass : this.positionClassDefault;
    let titleToast = title ? title : 'Info';

    this.toastr.info(message, titleToast, config);
  }

  // Metodo per mostrare un toast di avviso con durata opzionale
  showWarning(message: string, title?: string, duration?: number, positionClass?: string) {
    const config: Partial<IndividualConfig> = {};
    config.timeOut = duration ? duration : this.durationDefault;
    config.positionClass = positionClass ? positionClass : this.positionClassDefault;

    let titleToast = title ? title : 'Warning';
    this.toastr.warning(message, titleToast, config);
  }
}
