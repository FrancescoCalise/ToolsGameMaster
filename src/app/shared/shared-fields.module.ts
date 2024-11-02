import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageUploaderComponent } from '../component/framework/fields/attachment-input/field-image-uploader.component';
import { FieldButtonComponent } from '../component/framework/fields/field-button/field-button.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ImageUploaderComponent,
    FieldButtonComponent 
  ],
  exports: [
    ImageUploaderComponent,
    FieldButtonComponent
  ]
})
export class SharedFields { }
