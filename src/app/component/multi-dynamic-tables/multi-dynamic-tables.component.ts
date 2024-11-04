import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TableConfig } from '../../interface/TableConfig';
import { ActivatedRoute } from '@angular/router';
import { DynamicTableComponent } from '../dynamic-table/dynamic-table.component';
import { TranslationMessageService } from '../../services/translation-message-service';

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

  @Input() multiTable!: TableConfig[];
  @Input() excludedColumns!: string[];
  constructor(private route: ActivatedRoute, private translationService: TranslationMessageService) {
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.multiTable = data['multiTable'];
      this.excludedColumns = data['excludedColumns']
    });
  }

  
}