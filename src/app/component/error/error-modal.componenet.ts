// error-modal.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorLog } from '../../interface/Document/ErrorLog';
import { TranslationMessageService } from '../../services/translation-message-service';
import { SpinnerService } from '../../services/spinner.service';
import { DynamicWrapperModalComponent } from '../framework/modal/dynamic-wrapper-modal.component';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.componenet.html',
  styleUrls: ['./error-modal.componenet.css'],
  standalone: true,
  imports: [
    SharedModule,
    ReactiveFormsModule,
    DynamicWrapperModalComponent
  ]
})

export class ErrorModalComponent implements OnInit {
  public title: string = '';
  public originalComponenetThatOpenSpinner: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ErrorLog,
    private dialogRef: MatDialogRef<ErrorModalComponent>,
    private translationMessageService: TranslationMessageService,
    private spinnerService: SpinnerService
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.originalComponenetThatOpenSpinner = this.spinnerService.openBy;
    this.title = await this.translationMessageService.translate("ERROR.TITLE");
    this.spinnerService.hide(this.originalComponenetThatOpenSpinner);
  }

  close(): void {
    this.dialogRef.close();
  }
}
