import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from './angular-material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule
  ]
})
export class SharedModule { }
