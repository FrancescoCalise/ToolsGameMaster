import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FeatureAreaComponent } from './feature-sitemap/feature-area.component';
import {  RouterOutlet } from '@angular/router';
import { SpinnerService } from '../../services/spinner.service';


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

export class GameLayoutComponent implements OnInit, OnDestroy {

    constructor(
        private spinner: SpinnerService
    ) {

    }

    ngOnDestroy(): void {
        this.spinner.hideSpinner();
    }

    async ngOnInit(): Promise<void> {
        this.spinner.showSpinner();
    }


}
