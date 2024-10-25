import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../shared.module';
import { AuthService, PersonalUser } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { BreakpointService } from '../../services/breakpoint.service';
import { FirestoreService } from '../../services/firestore.service';
import { Donation } from '../../interface/donation';
import { SpinnerService } from '../../services/spinner.service';


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

  isMobile: boolean = false;
  private breakpointSubscription: Subscription = new Subscription;;

  linksDonateImg: Record<string, string> = {
    "IT": "https://www.paypalobjects.com/it_IT/IT/i/btn/btn_donate_LG.gif",
    "EN": "https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"
  };

  constructor(
    private authService: AuthService,
    private languageService: LanguageService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private breakpointService: BreakpointService,
    private cdr: ChangeDetectorRef,
    private firestoreDonationService: FirestoreService<Donation>,
    private spinner: SpinnerService
  ) {
    this.firestoreDonationService.setCollectionName('donation');
  }

  ngOnInit(): void {
    this.languageSubscription = this.languageService.subscribeToLanguageChanges()
      .subscribe((newLang: string) => {
        this.currentLang = newLang;
        const currentLink = this.linksDonateImg[this.currentLang] || this.linksDonateImg['IT'];
        this.clearPayPalButtonContainer();
        this.renderPayPalDonateButton(currentLink);
      });

    this.currentLang = this.languageService.getLanguage();

    this.breakpointSubscription = this.breakpointService.subscribeToBreakpointChanges()
      .subscribe((isMobile: boolean) => {
        this.clearPayPalButtonContainer();
        this.isMobile = isMobile;
        const currentLink = this.linksDonateImg[this.currentLang] || this.linksDonateImg['IT'];
        this.renderPayPalDonateButton(currentLink);
      });
  }

  ngAfterViewInit(): void {
    let currentLink = this.linksDonateImg[this.currentLang] || this.linksDonateImg['IT'];
    this.renderPayPalDonateButton(currentLink);
    this.isMobile = this.breakpointService.getIsMobile();
    this.cdr.detectChanges();
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
    let idDiv = this.isMobile ? 'paypal-donate-button-container-mobile' : 'paypal-donate-button-container';
    const paypalContainer = document.getElementById(idDiv);

    if (paypalContainer) {
      paypalContainer.innerHTML = ''; // Svuota il contenuto del div
    }
  }

  renderPayPalDonateButton(currentLink: string) {
    let idDiv = this.isMobile ? 'paypal-donate-button-container-mobile' : 'paypal-donate-button-container';

    setTimeout(() => {
      const container = document.getElementById(idDiv);
      if (!container) {
        console.error(`Donate Button Container not found for #${idDiv}`);
        return;
      }

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
            .subscribe(async (translation: string) => {
              console.log('Donation completed: ', details);
              await this.saveLastDonation();
              this.toastService.showSuccess(translation);

            });
        },
        onError: (err: any) => {
          this.translateService.get('SYSTEM_FOOTER.DONATION_ERROR')
            .subscribe((translation: string) => {
              this.toastService.showError(translation, err, 5000);
            });
        }
      }).render(`#${idDiv}`);
    }, 0);
  }

  async saveLastDonation() {
    if (!this.isAuthenticating) return;
    let user = this.user as PersonalUser;
    let donation = (await this.firestoreDonationService.getItem(user.uid));
    if (!donation) {
      donation = {
        lastDonation: new Date()
      }
      this.firestoreDonationService.addItem(donation, user.uid);
    } else {
      donation.lastDonation = new Date();
      this.firestoreDonationService.updateItem(donation);
    }
  }

  ngOnDestroy(): void {
    // Disiscriviti quando il componente viene distrutto per prevenire memory leak
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
  }
}  
