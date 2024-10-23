import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { Role, RoleType } from '../../interface/roles';
import { FirestoreService } from '../../services/firestore.service';
import { QueryFieldFilterConstraint, where } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [SharedModule]
})
export class LoginComponent {
  isAuthLoginCompleted: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private firestoreService: FirestoreService<Role>
  ) {
    this.firestoreService.setCollectionName('roles');
  }

  async login() {
    try {
      var userCredential = await this.authService.loginWithGoogle();
      if(this.authService.isInLogin) {       
        let role = (await this.firestoreService.getItem(userCredential.user.uid));
        if(!role){
          role = {
            type: RoleType.User
          }
          this.firestoreService.addItem(role, userCredential.user.uid);
        }
        this.authService.setRoleType(role.type);
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
