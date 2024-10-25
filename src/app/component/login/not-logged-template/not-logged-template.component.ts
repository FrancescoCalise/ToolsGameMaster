import { AfterViewInit, Component, Inject, InjectionToken, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { FirestoreService } from '../../../services/firestore.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SpinnerService } from '../../../services/spinner.service';
import { ToastService } from '../../../services/toast.service';
import { RoleType, UserInformationSaved } from '../../../interface/Document/UserInformationSaved';

export const USER_FIRESTORE_SERVICE = new InjectionToken<FirestoreService<UserInformationSaved>>('UserFirestoreService');

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
    { provide: USER_FIRESTORE_SERVICE, useClass: FirestoreService }
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
    @Inject(USER_FIRESTORE_SERVICE) private firestoreUserService: FirestoreService<UserInformationSaved>
  ) {
    this.firestoreUserService.setCollectionName('users');

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
        let user = (await this.firestoreUserService.getItem(userCredential.user.uid));
        if(!user){
          user = {
            role: RoleType.User,
            email: userCredential.user.email as string,
            lastDonation: null
          }
          this.firestoreUserService.addItem(user, userCredential.user.uid);
        }
        this.authService.setExtraInformation(user);
        this.authService.completeLogin();
      }

      this.isAuthLoginCompleted = this.authService.isAuthLoginCompleted();
      if (this.isAuthLoginCompleted) {
        this.router.navigate(['/']);
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
