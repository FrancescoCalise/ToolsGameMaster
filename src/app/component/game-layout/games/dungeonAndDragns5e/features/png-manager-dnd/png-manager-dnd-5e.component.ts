import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { SharedModule } from '../../../../../../shared/shared.module';
import { SharedFields } from '../../../../../../shared/shared-fields.module';
import { SessionManager } from '../../../../../../interface/Document/SessionManager';
import { SessionManagerWidgetComponent } from '../../../../../session-manager-widget/session-manager-widget.component';
import { PNG_5E } from '../../interface/png_5e-interface';
import { QueryFieldFilterConstraint, where } from 'firebase/firestore';
import { PNG_SHEET_DND_5 } from '../../../../../../firebase-provider';
import { FirestoreService } from '../../../../../../services/firestore.service';
import { dnd5eConfig } from '../../dnd-5e-config';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DynamicWrapperModalComponent } from '../../../../../framework/modal/dynamic-wrapper-modal.component';
import { PNGreviewDialogComponent } from '../png-generator/png-card-preview/png-card-preview-componenet';
import { DialogService } from '../../../../../../services/dialog.sevice';

@Component({
  selector: 'app-png-manager-dnd-5e',
  templateUrl: './png-manager-dnd-5e.component.html',
  styleUrls: ['./png-manager-dnd-5e.component.css'],
  standalone: true,
  imports: [SharedModule, SharedFields, SessionManagerWidgetComponent, DynamicWrapperModalComponent]
})
export class PNGManagerDnd5e implements OnInit, OnDestroy {
  public configGame = dnd5eConfig;
  defaultSession: SessionManager | undefined = undefined;
  sessionLoaded = false;

  pngList: PNG_5E[] = [];

  constructor(
    @Inject(PNG_SHEET_DND_5) private firestoreLogService: FirestoreService<PNG_5E>,
    private dialogRef: MatDialogRef<PNGManagerDnd5e>,
    private router: Router,
    private dialogService: DialogService
  ){
    firestoreLogService.setCollectionName('png-sheet-dnd-5e');
  }

  async onSessionLoaded(loadedSession: SessionManager): Promise<void> {
    this.defaultSession = loadedSession;
    this.sessionLoaded = true;
    await this.loadPngList()
  }

  async ngOnInit(): Promise<void> {
    await this.loadPngList();
  }

  async loadPngList() {
    if (!this.defaultSession) return;
        let sessionId = this.defaultSession?.id;
        let whereConditions: QueryFieldFilterConstraint[] = [];
        whereConditions.push(where('sessionId', '==', sessionId));
        this.pngList = await this.firestoreLogService.getItemsWhere(whereConditions);
  }

  ngOnDestroy(): void {
    if (this.defaultSession) {
      this.defaultSession = undefined;
    }
  }

  async deleteCharacter(png: PNG_5E) {
    await this.firestoreLogService.deleteItem(png.id as string);
    this.pngList = this.pngList.filter((item) => item.id !== png.id);
  }

  async openPreview(png: PNG_5E) {
    this.dialogService.open(PNGreviewDialogComponent, {
      panelClass: 'png-preview-dialog',
      data: png
  });
  }

  goToEdit(png: PNG_5E) {
    this.close();
    const path = `games/${this.configGame.id}/${this.configGame.features.find((feature) => feature.id === 'PNG_GENERATOR')?.id}`;
    const queryParams = png.id ? { pngId: png.id } : {};
    this.router.navigate([path], { queryParams }).then(() => {
        console.log(`Navigazione a ${path} completata con queryParams:`, queryParams);
    });
}

  close(): void {
    this.dialogRef.close();
  }
}