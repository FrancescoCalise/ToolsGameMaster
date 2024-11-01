import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FeatureAreaComponent } from './feature-sitemap/feature-area.component';
import {  RouterOutlet } from '@angular/router';


@Component({
    selector: 'app-game-layout',
    templateUrl: './game-layout.component.html',
    styleUrl: './game-layout.component.css',
    standalone: true,
    imports: [
        SharedModule,
        FeatureAreaComponent,
        RouterOutlet
    ],

})

export class GameLayoutComponent  {

}
