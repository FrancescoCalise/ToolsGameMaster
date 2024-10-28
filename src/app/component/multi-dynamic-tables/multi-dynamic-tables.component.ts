import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TableConfig } from '../../interface/TableConfig';
import { ActivatedRoute } from '@angular/router';
import { DynamicTableComponent } from '../dynamic-table/dynamic-table.component';

@Component({
  selector: 'app-multi-dynamic-table',
  templateUrl: './multi-dynamic-tables.component.html',
  styleUrls: ['./multi-dynamic-tables.component.css'],
  standalone: true,
  imports: [
    SharedModule,
    DynamicTableComponent
  ],
})
export class MultiDynamicTablesComponent implements OnInit {

  @Input() config!: TableConfig[];

  constructor(private route: ActivatedRoute){
    
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.config = data['data'];
    });

  }
}