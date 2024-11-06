import { ChangeDetectorRef, Directive, OnInit } from "@angular/core";
import { GameConfig } from "../../../../interface/GameConfig";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { BreakpointService } from "../../../../services/breakpoint.service";
import { PdfService } from "../../../../services/pdf.service";
import { ToastService } from "../../../../services/toast.service";
import { CacheStorageService } from "../../../../services/cache-storage.service";
import { TranslationMessageService } from "../../../../services/translation-message-service";

@Directive()
export class GameBaseComponent implements OnInit {
    public gameName = '';
    public gameConfig: GameConfig = {} as GameConfig;
    public deviceType = '';
    public showSiteMap = true;
    
    constructor(
        protected route: ActivatedRoute,
        protected router: Router, 
        protected pdfService: PdfService,
        protected toastService: ToastService,
        protected cdr: ChangeDetectorRef,
        protected breakPointService: BreakpointService,
        protected dialog: MatDialog,
        protected cacheStorage: CacheStorageService,
        protected translationMessageService: TranslationMessageService
    ) {}

    async ngOnInit(): Promise<void> {
        this.gameName = this.route.snapshot.data['gameName'];
        if (!this.gameName) {
            throw new Error('Route is not properly configured');
        }

        this.deviceType = this.breakPointService.currentDeviceType;
        this.breakPointService.subscribeToBreakpointChanges().subscribe(
            (deviceType) => {
                this.deviceType = deviceType;
            }
        );
    }

    protected onToggleSiteMap(show: boolean) {
        this.showSiteMap = show;
        this.cdr.detectChanges();
    }

    protected isSmallDevice(): boolean {
      return this.breakPointService.isSmallDevice(this.deviceType);
    }
}
