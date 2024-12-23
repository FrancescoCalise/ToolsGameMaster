import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FeatureConfig } from '../../../interface/FeatureConfig';
import { MatDialogConfig } from '@angular/material/dialog';
import { TranslationMessageService } from '../../../services/translation-message-service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { GameConfig } from '../../../interface/GameConfig';
import { BreakpointService } from '../../../services/breakpoint.service';
import { filter, Subscription } from 'rxjs';
import { DialogService } from '../../../services/dialog.sevice';


@Component({
    selector: 'app-feature-area',
    templateUrl: './feature-area.component.html',
    styleUrl: './feature-area.component.css',
    standalone: true,
    imports: [
        SharedModule
    ],

})

export class FeatureAreaComponent implements OnInit, OnDestroy {

    @Input() gameConfig: GameConfig = {} as GameConfig;
    @Output() toggoleSiteMap: EventEmitter<boolean> = new EventEmitter<boolean>();

    activeFeatures: FeatureConfig[] = [];
    activatedUrl: string = '';
    menuOpen: boolean = true;
    deviceType: string = '';
    private deviceTypeSub: Subscription = new Subscription();
    private routeChangeSub: Subscription = new Subscription();
    public hideLabel: boolean = false;
    private langSubscription!: Subscription;

    constructor(
        private translationMessageService: TranslationMessageService,
        private route: ActivatedRoute,
        private router: Router,
        private breakPointService: BreakpointService,
        private dialogService: DialogService
    ) { }

    ngOnDestroy(): void {
        if (this.deviceTypeSub) {
            this.deviceTypeSub.unsubscribe();
        }
        if (this.langSubscription) {
            this.langSubscription.unsubscribe();
        }
        if (this.routeChangeSub) {
            this.routeChangeSub.unsubscribe();
        }
    }

    async ngOnInit(): Promise<void> {
        this.deviceType = this.breakPointService.currentDeviceType;
        this.deviceTypeSub = this.breakPointService.subscribeToBreakpointChanges().subscribe(
            (deviceType) => {
                this.deviceType = deviceType;
            });

        if (!this.gameConfig.id) {
            throw new Error('GameConfig is required');
        }

        this.langSubscription = this.translationMessageService.onLanguageChange()
            .subscribe(async (newLang) => {
                await this.translateGameConfig();
            });

        // Sottoscrizione per aggiornare `activatedUrl` quando cambia la route
        this.routeChangeSub = this.router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
            this.activatedUrl = event.urlAfterRedirects.split('?')[0].split('#')[0];
        });

        await this.translateGameConfig();
        this.activatedUrl = this.router.url;
    }

    isSmallDevice(): boolean {
        return this.breakPointService.isSmallDevice(this.deviceType);
    }

    async translateGameConfig() {

        this.gameConfig.title = await this.translationMessageService.translate(`${this.gameConfig.title}`);
        this.activeFeatures = this.gameConfig.features;
        for (const feature of this.activeFeatures) {
            feature.description = await this.translationMessageService.translate(`FEATURE.${feature.id}`);
            //feature.tooltip = await this.translationMessageService.translate(`FEATURE.TOOLTIP_${feature.id}`);
        }

    }

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
        this.toggoleSiteMap.emit(this.menuOpen);
    }


    getFeatureUrl(feature: any): string {
        let featreUrl = `/${this.getFullPath(this.route)}/${feature.id}`
        return featreUrl;
    }

    activateFeature(feature: FeatureConfig) {
        if (feature.changePage) {
            let navigateTo = `/${this.getFullPath(this.route)}/${feature.id}`;
            navigateTo = navigateTo.split('?')[0].split('#')[0];
            this.activatedUrl = navigateTo;
            this.router.navigateByUrl(navigateTo);
        } else {
            this.openFeature(feature.component);
        }
    }

    getFullPath(route: ActivatedRoute): string {
        let path = route.snapshot.url.map(segment => segment.path).join('/');
        while (route.parent) {
            route = route.parent;
            const parentPath = route.snapshot.url.map(segment => segment.path).join('/');
            if (parentPath) {
                path = `${parentPath}/${path}`;
            }
        }
        return path;
    }

    openFeature(component: any, config: MatDialogConfig = {}) {
        this.dialogService.open(component);
    }
}
