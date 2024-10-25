import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SharedModule } from '../../shared/shared.module';
import { NotLoggedTemplateComponent } from './not-logged-template/not-logged-template.component';

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

export class LoginComponent implements OnInit {
  isAuthLoginCompleted: boolean = false;

  constructor(
    private authService: AuthService
  ) {

  }

  ngOnInit(): void {
    this.isAuthLoginCompleted = this.isAuthLoginCompleted;
  }
}
