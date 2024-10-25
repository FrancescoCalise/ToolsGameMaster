import { AfterViewInit, Component, Inject, InjectionToken, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { Role, RoleType } from '../../../interface/roles';
import { FirestoreService } from '../../../services/firestore.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SpinnerService } from '../../../services/spinner.service';
import { ToastService } from '../../../services/toast.service';
import { Donation } from '../../../interface/donation';

export const ROLE_FIRESTORE_SERVICE = new InjectionToken<FirestoreService<Role>>('RoleFirestoreService');
export const DONATION_FIRESTORE_SERVICE = new InjectionToken<FirestoreService<Donation>>('DonationFirestoreService');

@Component({
  selector: 'app-not-logged-template',
  templateUrl: './not-logged-template.component.html',
  styleUrls: ['./not-logged-template.component.css'],
  standalone: true,
  imports: [
    SharedModule,
    ReactiveFormsModule
   ],
   providers: [
    { provide: ROLE_FIRESTORE_SERVICE, useClass: FirestoreService },
    { provide: DONATION_FIRESTORE_SERVICE, useClass: FirestoreService }
  ]
})
export class NotLoggedTemplateComponent implements OnInit, AfterViewInit {
  isAuthLoginCompleted: boolean = false;
  selectedLanguage = 'IT';
  languages = ['EN', 'IT',];
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private spinner: SpinnerService,
    private toastService: ToastService,
    @Inject(ROLE_FIRESTORE_SERVICE) private firestoreRoleService: FirestoreService<Role>,
    @Inject(DONATION_FIRESTORE_SERVICE) private firestoreDonationService: FirestoreService<Donation>

  ) {
    this.firestoreRoleService.setCollectionName('roles');
    this.firestoreDonationService.setCollectionName('donation');


  }
  
  ngAfterViewInit(): void {
    this.spinner.hideSpinner();
  }
  
  ngOnInit(): void {
   
  }
  
  async loginWithGoogle() {
    try {
      var userCredential = await this.authService.loginWithGoogle();
      if(this.authService.isInLogin) {

        let role = (await this.firestoreRoleService.getItem(userCredential.user.uid));
        if(!role){
          role = {
            type: RoleType.User
          }
          this.firestoreRoleService.addItem(role, userCredential.user.uid);
        }

        let donation = (await this.firestoreDonationService.getItem(userCredential.user.uid));
        if(!donation){
          donation = {
            lastDonation: null
          }
          this.firestoreDonationService.addItem(donation, userCredential.user.uid);
        }

        this.authService.setExtraInformation(role.type, donation.lastDonation);
        this.authService.completeLogin();
      }

      this.isAuthLoginCompleted = this.authService.isAuthLoginCompleted();
      if (this.isAuthLoginCompleted) {
        this.router.navigate(['/home']);
      } else {
        throw new Error('User is not authenticated');
      }
    } catch (error) {
      console.error('Error during login: ', error);
    }
  }

  async logout() {
    try {
      this.toastService.showSuccess('User logged out');
      await this.authService.logout();
      console.log('User logged out');
    } catch (error) {
      var message  = 'Error during logout: ' + error;
      this.toastService.showError(message);
      console.error(message);
    }
  }
}
