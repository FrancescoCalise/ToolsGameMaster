import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-game-dugeon-and-dragons-5e',
   templateUrl: './dungeonanddragons5e.component.html',
  styleUrl: './dungeonanddragons5e.component.css',
  standalone: true,
  imports: [
    SharedModule
  ],
 
})

export class DungeonAndDragons5eComponent {

  constructor(private router: Router) {}

 
}