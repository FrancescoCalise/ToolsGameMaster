// error-modal.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorLog } from '../../interface/Document/ErrorLog';
import { TranslationMessageService } from '../../services/translation-message-service';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.componenet.html',
  styleUrls: ['./error-modal.componenet.css'],
  standalone: true,
  imports: [
    SharedModule,
    ReactiveFormsModule
  ]
})

export class ErrorModalComponent implements OnInit {
  public title: string = '';
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ErrorLog,
    private dialogRef: MatDialogRef<ErrorModalComponent>,
    private translationMessageService: TranslationMessageService
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.title = await this.translationMessageService.translate("ERROR.TITLE");

  }

  close(): void {
    this.dialogRef.close();
  }
}
