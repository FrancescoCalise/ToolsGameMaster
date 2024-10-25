import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  constructor(private toastr: ToastrService) {}

  // Metodo per mostrare un toast di successo con durata opzionale
  showSuccess(message: string, title?: string, duration?: number) {
    const config: Partial<IndividualConfig> = duration ? { timeOut: duration } : {};
    this.toastr.success(message, title, config);
  }

  // Metodo per mostrare un toast di errore con durata opzionale
  showError(message: string, title?: string, duration?: number) {
    const config: Partial<IndividualConfig> = duration ? { timeOut: duration } : {};
    this.toastr.error(message, title, config);
  }

  // Metodo per mostrare un toast informativo con durata opzionale
  showInfo(message: string, title?: string, duration?: number) {
    const config: Partial<IndividualConfig> = duration ? { timeOut: duration } : {};
    this.toastr.info(message, title, config);
  }

  // Metodo per mostrare un toast di avviso con durata opzionale
  showWarning(message: string, title?: string, duration?: number) {
    const config: Partial<IndividualConfig> = duration ? { timeOut: duration } : {};
    this.toastr.warning(message, title, config);
  }
}
