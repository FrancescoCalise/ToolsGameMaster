import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { AuthService, PersonalUser } from '../../../services/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit{
  user: PersonalUser = {} as PersonalUser;
  userPhoto: string = ''; // Variabile per l'immagine precaricata
  lastDonationDate: Date | null = null;

  constructor(private authService: AuthService) {

  }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser() as PersonalUser;
    this.preloadUserPhoto();
    let timeStamp = this.user.lastDonation;
    this.lastDonationDate = new Date((timeStamp?.seconds as number) * 1000) || null;

    console.log(this.user);
  }
  preloadUserPhoto(): void {
    const img = new Image();
    img.src = this.user.photoURL as string;
    img.onload = () => {
      this.userPhoto = this.user.photoURL as string;
    };
  }

}
