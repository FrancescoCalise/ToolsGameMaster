import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { TableConfig } from '../../../interface/TableConfig';
import { ActivatedRoute } from '@angular/router';
import { TranslationMessageService } from '../../../services/translation-message-service';
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

  @Input() multiTable!: TableConfig[];
  @Input() excludedColumnsToTranslate!: string[];
  constructor(private route: ActivatedRoute, private translationService: TranslationMessageService) {
  }

  async ngOnInit(): Promise<void> {
    this.route.data.subscribe((data) => {
      this.multiTable = data['multiTable'];
      this.excludedColumnsToTranslate = data['excludedColumnsToTranslate']
    });

    this.multiTable.forEach(async table => {
      if(table.title){
        table.title = await this.translationService.translate(table.title);
      }
    });
  }

  
}