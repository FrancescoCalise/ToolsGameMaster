import { Component, OnInit, } from '@angular/core';
import { SharedModule } from '../../../../../../shared/shared.module';
import { ToastService } from '../../../../../../services/toast.service';

@Component({
  selector: 'app-generate-character-lur',
  templateUrl: './generate-character-lur.component.html',
  styleUrl: './generate-character-lur.component.css',
  standalone: true,
  imports: [
    SharedModule,
  ],

})

export class GenerateCharacterLurComponenet implements OnInit{
 

  constructor(
    private toastService: ToastService,
  ) { }

  async ngOnInit(): Promise<void> {
  
  }
  
  

}
