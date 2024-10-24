import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from './angular-material.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    TranslateModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    TranslateModule
  ]
})
export class SharedModule { }
