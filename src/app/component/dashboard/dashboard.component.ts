import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Game } from '../../interface/Game';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
   templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true,
  imports: [
    SharedModule
  ],
 
})

export class DashboardComponent {
  games: Game[] = [
    {
      name: "Dungeon & Dragons 5e",
      image: "assets/images/games/dnd5e.jpg",
      route: "/games/dungeon-and-dragons-5e"
    },
    {
      name: "L'Ultima Rotta",
      image: "assets/images/games/ultima-rotta.jpg",
      route: "/games/ultima-rotta"
    }
  ];

  constructor(private router: Router) {}

  navigateToGame(route: string): void {
    this.router.navigate([route]);
  }
}