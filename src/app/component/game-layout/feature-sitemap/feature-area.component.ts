import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FeatureConfig } from '../../../interface/FeatureConfig';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslationMessageService } from '../../../services/translation-message-service';
import { ToastService } from '../../../services/toast.service';
import { allFeatures } from '../all-features/all-features';


@Component({
    selector: 'app-feature-area',
    templateUrl: './feature-area.component.html',
    styleUrl: './feature-area.component.css',
    standalone: true,
    imports: [
        SharedModule
    ],

})

export class FeatureAreaComponenet implements OnInit {

    @Input() gameName: string = '';
    activeFeatures: any;

    constructor(
        private dialog: MatDialog,
        private translationMessageService: TranslationMessageService,
        private toastService: ToastService,
    ) {
    }

    ngOnInit(): void {
        this.loadDynamicFeatures();
    }

    async loadDynamicFeatures() {
        if (this.gameName !== '') {
            this.activeFeatures = allFeatures.filter(feature =>
                feature.owner.includes(this.gameName as string)
            );

            this.activeFeatures.forEach(async (feature: FeatureConfig) => {
                feature.description = await this.translationMessageService.translate(`FEATURE.${feature.id}`);
                feature.tooltip = await this.translationMessageService.translate(`FEATURE.TOOLTIP_${feature.id}`);
            });
        }
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
