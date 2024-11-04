import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FeatureConfig } from '../../../interface/FeatureConfig';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslationMessageService } from '../../../services/translation-message-service';
import { ToastService } from '../../../services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GameConfig } from '../../../interface/GameConfig';
import { BreakpointService } from '../../../services/breakpoint.service';
import { Subscription } from 'rxjs';


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
    private deviceTypeSub: Subscription = new Subscription;
    public hideLabel: boolean = false;
    private langSubscription!: Subscription;
    
    constructor(
        private dialog: MatDialog,
        private translationMessageService: TranslationMessageService,
        private toastService: ToastService,
        private route: ActivatedRoute,
        private router: Router,
        private breakPointService: BreakpointService
    ) { }

    ngOnDestroy(): void {
        if (this.deviceTypeSub) {
            this.deviceTypeSub.unsubscribe();
        }
        if(this.langSubscription){
            this.langSubscription.unsubscribe();
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
            feature.tooltip = await this.translationMessageService.translate(`FEATURE.TOOLTIP_${feature.id}`);
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
        const dialogConfig = {
            width: '90vw',
            height: '90vh',
            maxWidth: '90vw',
            maxHeight: '90vh',
            panelClass: 'full-screen-dialog',
            ...config
        };
        this.dialog.open(component, dialogConfig);
    }
}
