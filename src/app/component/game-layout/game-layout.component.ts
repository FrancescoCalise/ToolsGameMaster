import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FeatureAreaComponenet } from './feature-sitemap/feature-area.component';
import { GameAreaComponenet } from './game-area/game-area.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FeatureConfig } from '../../interface/FeatureConfig';
import { SpinnerService } from '../../services/spinner.service';


@Component({
    selector: 'app-game-layout',
    templateUrl: './game-layout.component.html',
    styleUrl: './game-layout.component.css',
    standalone: true,
    imports: [
        SharedModule,
        FeatureAreaComponenet,
        GameAreaComponenet
    ],

})

export class GameLayoutComponent implements OnInit, OnDestroy {

    activeFeatures: FeatureConfig[] = [];
    gameName: string = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private spinner: SpinnerService
    ) {

    }

    ngOnDestroy(): void {
        this.spinner.hideSpinner();
    }

    async ngOnInit(): Promise<void> {
        this.spinner.showSpinner();

        await this.setGameName();
    }

    async setGameName() {
        const children = this.route.snapshot?.routeConfig?.children;
        const current = this.router.url.split('/').pop() as string;
        if (children) {
            const currentChild = children.find(child => child.path === current);
            if (currentChild) {
                const data = currentChild.data;
                if (data) {
                    this.gameName = data['gameName'];
                    return;
                }
            }
        }

        if(!this.gameName)
            this.router.navigate(['/']);
    }

}
