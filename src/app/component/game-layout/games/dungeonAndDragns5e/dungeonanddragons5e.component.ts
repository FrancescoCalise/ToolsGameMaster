import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';
import { PdfService } from '../../../../services/pdf.service';

@Component({
  selector: 'app-game-dugeon-and-dragons-5e',
  templateUrl: './dungeonanddragons5e.component.html',
  styleUrl: './dungeonanddragons5e.component.css',
  standalone: true,
  imports: [
    SharedModule
  ],

})

export class DungeonAndDragons5eComponent implements OnInit {

  constructor(private router: Router, private pdfService: PdfService) {

  }

  async ngOnInit(): Promise<void> {
    //this.readPDF();
  }

  async readPDF() {
    await this.pdfService.loadPdf("assets/pdfFiles/IT/dnd-5e-template.pdf")
    let fields = await this.pdfService.getAllFields();
    
    console.log(fields);
  }


}