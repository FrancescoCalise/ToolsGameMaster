import { Component } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule],
  template: `
    <div>
      <ngx-spinner bdColor="rgba(51,51,51,0.8)" size="medium" color="#fff" type="ball-scale-multiple">
      </ngx-spinner>
    </div>
  `
})

export class LoadingComponent {
  constructor() {}
}
