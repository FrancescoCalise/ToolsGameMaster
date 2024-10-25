import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { Role, RoleType } from '../../interface/roles';
import { FirestoreService } from '../../services/firestore.service';
import { QueryFieldFilterConstraint, where } from '@angular/fire/firestore';
import { NotLoggedTemplateComponent } from './not-logged-template/not-logged-template.component';
import { Donation } from '../../interface/donation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    SharedModule,
    NotLoggedTemplateComponent
  ]
})

export class LoginComponent {
  isAuthLoginCompleted: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private firestoreRoleService: FirestoreService<Role>,
    private firestoreDonationService: FirestoreService<Donation>
  ) {
    this.firestoreRoleService.setCollectionName('roles');
    this.firestoreDonationService.setCollectionName('donation');
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

        this.authService.setExtraInformation(role.type);
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
      await this.authService.logout();
      console.log('User logged out');
    } catch (error) {
      console.error('Error during logout: ', error);
    }
  }
}
