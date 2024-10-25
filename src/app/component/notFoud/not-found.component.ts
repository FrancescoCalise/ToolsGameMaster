import { AfterViewInit, Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent implements AfterViewInit {
  constructor(private spinner: SpinnerService) {}

  ngAfterViewInit(): void {
    this.spinner.hideSpinner();
  }

}
