import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FeatureConfig } from '../../../interface/FeatureConfig';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslationMessageService } from '../../../services/translation-message-service';
import { ToastService } from '../../../services/toast.service';
import { allFeatures } from './all-features/all-features';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    selector: 'app-feature-area',
    templateUrl: './feature-area.component.html',
    styleUrl: './feature-area.component.css',
    standalone: true,
    imports: [
        SharedModule
    ],

})

export class FeatureAreaComponent implements OnInit {
    @Input() gameName: string = '';

    activeFeatures: FeatureConfig[] = [];
    activatedUrl: string = '';

    constructor(
        private dialog: MatDialog,
        private translationMessageService: TranslationMessageService,
        private toastService: ToastService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    async ngOnInit(): Promise<void> {
        await this.loadDynamicFeatures();
        this.activatedUrl = this.router.url;
    }

    async loadDynamicFeatures() {
        if (this.gameName !== '') {
            // Filtra le feature attive per il gioco specificato
            this.activeFeatures = allFeatures.filter(feature =>
                feature.owner.includes(this.gameName)
            );

            // Traduzioni per `description` e `tooltip` delle feature attive
            for (const feature of this.activeFeatures) {
                feature.description = await this.translationMessageService.translate(`FEATURE.${feature.id}`);
                feature.tooltip = await this.translationMessageService.translate(`FEATURE.TOOLTIP_${feature.id}`);
            }
        }
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
