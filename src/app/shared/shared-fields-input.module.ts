import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageUploaderComponent } from '../component/framework/fields/attachment-input/fields-image-uploader.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ImageUploaderComponent 
  ],
  exports: [
    ImageUploaderComponent
  ]
})
export class SharedFieldsInputModule { }
