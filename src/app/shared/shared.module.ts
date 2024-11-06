import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from './angular-material.module';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    TranslateModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
