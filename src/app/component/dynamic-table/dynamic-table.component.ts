import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TableConfig } from '../../interface/TableConfig';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css'],
  standalone: true,
  imports: [
    SharedModule
  ],
})
export class DynamicTableComponent implements OnInit {
  notesToShow: { symbol: string; description: string }[] = [];

  @Input() table!: TableConfig;

  constructor(private router: Router){
    
  }

  ngOnInit(): void {
    if (this.table == null) {
      this.router.navigate(['/']);
      throw new Error('TableConfig is null');
    }

    this.generateNotes();
  }

  generateNotes(): void {
    const notesMap = new Map<string, string>();
    this.table.notes?.forEach(note => {
      if (note != null && note.symbol != '' && !notesMap.has(note.symbol)) {
        notesMap.set(note.symbol, note.description);
      }
    });
  
    // Converti in array di oggetti con simbolo e descrizione
    this.notesToShow = Array.from(notesMap, ([symbol, description]) => ({ symbol, description }));
  }


}