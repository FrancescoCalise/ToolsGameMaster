import { AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../shared.module';
import { AuthService, PersonalUser } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-system-footer',
  templateUrl: './system-footer.component.html',
  styleUrls: ['./system-footer.component.css'],
  standalone: true,
  imports: [
    SharedModule
  ]
})

export class SystemFooterComponent implements OnInit, AfterViewChecked, AfterViewInit, OnDestroy {

  canShow = true;
  isAuthenticating: boolean = false;
  haveDonationValid: boolean = false;
  user: PersonalUser | null = null;
  currentLang: string = 'IT';
  private languageSubscription: Subscription = new Subscription;

  linksDonateImg: Record<string, string> = {
    "IT": "https://www.paypalobjects.com/it_IT/IT/i/btn/btn_donate_LG.gif",
    "EN": "https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"
  };

  constructor(
    private authService: AuthService,
    private languageService: LanguageService,
    private toastService: ToastService,
    private translateService: TranslateService
  ) {

  }

  ngOnInit(): void {
    // Sottoscriviti ai cambiamenti di lingua
    this.languageSubscription = this.languageService.subscribeToLanguageChanges()
      .subscribe((newLang: string) => {
        this.currentLang = newLang;
        let currentLink = this.linksDonateImg[this.currentLang] || this.linksDonateImg['IT'];
        this.clearPayPalButtonContainer();
        this.renderPayPalDonateButton(currentLink);
      });

    // Imposta la lingua corrente all'inizio
    this.currentLang = this.languageService.getLanguage();
  }

  ngAfterViewInit(): void {
    let currentLink = this.linksDonateImg[this.currentLang] || this.linksDonateImg['IT'];
    this.renderPayPalDonateButton(currentLink);
  }

  ngAfterViewChecked(): void {
    this.isAuthenticating = this.authService.isAuthLoginCompleted();
    if (this.isAuthenticating) {
      this.user = this.authService.getCurrentUser();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1); // Sottrai un mese dalla data corrente

      var lastDonationDate = this.user?.lastDonation as Date;
      this.haveDonationValid = lastDonationDate !== undefined && lastDonationDate >= oneMonthAgo;
      if (!this.haveDonationValid) {
        this.canShow = true;
      } else {
        this.canShow = false;
      }
    }


  }

  clearPayPalButtonContainer(): void {
    const paypalContainer = document.getElementById('paypal-donate-button-container');
    if (paypalContainer) {
      paypalContainer.innerHTML = ''; // Svuota il contenuto del div
    }
  }

  renderPayPalDonateButton(currentLink: string) {
    // @ts-ignore
    PayPal.Donation.Button({
      env: 'production', // Usa 'production' per la modalità di produzione
      hosted_button_id: 'DHARMWSVJYYL2',
      style: {
        layout: 'vertical', // Mostra il pulsante in layout verticale senza le carte
        color: 'blue', // Colore del pulsante
        shape: 'rect', // Forma rettangolare del pulsante
        label: 'donate' // Etichetta del pulsante (donate)
      },
      image: {
        src: currentLink
      },
      onComplete: (details: any) => {
        this.translateService.get('SYSTEM_FOOTER.DONATION_SUCCESS')
          .subscribe((translation: string) => {
            this.toastService.showSuccess(translation);
          });
      },
      onError: (err: any) => {
        this.translateService.get('SYSTEM_FOOTER.DONATION_ERROR')
          .subscribe((translation: string) => {
            this.toastService.showError(translation,err, 5000);
          });
      }
    })
      .render('#paypal-donate-button-container');
  }

  ngOnDestroy(): void {
    // Disiscriviti quando il componente viene distrutto per prevenire memory leak
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }
}  
