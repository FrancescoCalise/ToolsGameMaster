import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.css'
})
export class UserSettingsComponent {
  constructor() {
  }

}
