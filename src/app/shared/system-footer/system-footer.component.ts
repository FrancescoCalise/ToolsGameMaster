import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../shared.module';
import { AuthService, PersonalUser } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { BreakpointService } from '../../services/breakpoint.service';
import { FirestoreService } from '../../services/firestore.service';
import { Timestamp } from 'firebase/firestore';
import { UserInformationSaved } from '../../interface/Document/UserInformationSaved';
import { TranslationMessageService } from '../../services/translation-message-service';
import { USER_FIRESTORE_SERVICE } from '../../firebase-provider';


@Component({
  selector: 'app-system-footer',
  templateUrl: './system-footer.component.html',
  styleUrls: ['./system-footer.component.css'],
  standalone: true,
  imports: [
    SharedModule
  ]
})

export class SystemFooterComponent implements OnInit, AfterViewInit, OnDestroy {

  showFooter = true;
  isAuthenticating: boolean = false;
  user: PersonalUser | null = null;

  currentLang: string = 'IT';
  private languageSubscription: Subscription = new Subscription;

  isMobile: boolean = false;
  private breakpointSubscription: Subscription = new Subscription;

  private userSubscription: Subscription = new Subscription;

  linksDonateImg: Record<string, string> = {
    "IT": "https://www.paypalobjects.com/it_IT/IT/i/btn/btn_donate_LG.gif",
    "EN": "https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"
  };
  public isButtonVisibile: boolean = false;

  constructor(
    private authService: AuthService,
    private languageService: LanguageService,
    private toastService: ToastService,
    private translationMessageService: TranslationMessageService,
    private breakpointService: BreakpointService,
    @Inject(USER_FIRESTORE_SERVICE) private firestoreUserService: FirestoreService<UserInformationSaved>
  ) {
    this.firestoreUserService.setCollectionName('users');
  }



  async ngOnInit(): Promise<void> {
    this.languageSubscription = this.languageService.subscribeToLanguageChanges()
      .subscribe(async (newLang: string) => {
        this.currentLang = newLang;
        const currentLink = this.linksDonateImg[this.currentLang] || this.linksDonateImg['IT'];
        this.clearPayPalButtonContainer();
        await this.renderPayPalDonateButton(currentLink);
      });

    this.currentLang = this.languageService.getLanguage();

    this.isMobile = this.breakpointService.getIsMobile();
    this.breakpointSubscription = this.breakpointService.subscribeToBreakpointChanges()
      .subscribe(async (isMobile: boolean) => {
        this.clearPayPalButtonContainer();
        this.isMobile = isMobile;
        await this.verifyDonationState();
      });

    this.userSubscription = this.authService.subscribeToUserChanges().subscribe(
      async (user: PersonalUser | null) => {
        this.user = user;
        await this.verifyDonationState();
      });
  }

  ngAfterViewInit(): void {

  }

  async toggleDonateButton(): Promise<void> {
    if (!this.isButtonVisibile) {
      let currentLink = this.linksDonateImg[this.currentLang] || this.linksDonateImg['IT'];
      await this.renderPayPalDonateButton(currentLink);
      this.isButtonVisibile = true;
    }
  }

  async verifyDonationState(): Promise<void>  {
    if (!this.user) {
      this.showFooter = true;
      await this.toggleDonateButton();
      return;
    }
    this.isAuthenticating = true;
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1); // Sottrai un mese dalla data corrente

    var timeStamp = this.user?.lastDonation as Timestamp;
    if(!timeStamp){
      await this.toggleDonateButton();
    }

    let lastDonationDate = timeStamp ? new Date(timeStamp.seconds * 1000) : undefined;
    let haveDonationValid = lastDonationDate !== undefined && lastDonationDate >= oneMonthAgo;

    if (!haveDonationValid) {
      this.showFooter = true;
      await this.toggleDonateButton();
    } else {
      this.showFooter = false;
      this.clearPayPalButtonContainer();
    }
  }

  clearPayPalButtonContainer(): void {
    let idDiv = this.isMobile ? 'paypal-donate-button-container' : 'paypal-donate-button-container';
    const paypalContainer = document.getElementById(idDiv);

    if (paypalContainer) {
      paypalContainer.innerHTML = ''; // Svuota il contenuto del div
      this.isButtonVisibile = false;
    }
  }

  async renderPayPalDonateButton(currentLink: string) {
    let idDiv = this.isMobile ? 'paypal-donate-button-container' : 'paypal-donate-button-container';

    setTimeout(async () => {
      const container = document.getElementById(idDiv);
      if (!container) {
      let err = await this.translationMessageService.translate('SYSTEM_FOOTER.CONTAINER_NOT_FOUND')
        throw new Error(err);
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
        onComplete: async (details: any) => {
          await this.translationMessageService.translate('SYSTEM_FOOTER.DONATION_SUCCESS')
          console.log('Donation completed: ', details);
          await this.saveLastDonation();
        },
        onError: async (err: any) => {
          await this.translationMessageService.translate('SYSTEM_FOOTER.DONATION_ERROR')
          throw new Error(err);
        }
      })
        .render(`#${idDiv}`);
      this.isButtonVisibile = true;
    }, 0);
  }

  async saveLastDonation() {
    if (!this.isAuthenticating) return;
    let user = this.user as PersonalUser;
    let userInformationSaved = (await this.firestoreUserService.getItem(user.uid));
    var date = new Date();
    var timeStamp = new Timestamp(date.getTime() / 1000, 0);
    if (userInformationSaved) {
      userInformationSaved.lastDonation = timeStamp;
      this.firestoreUserService.updateItem(userInformationSaved);
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
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}  
