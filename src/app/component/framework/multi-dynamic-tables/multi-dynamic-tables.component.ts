import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { TableConfig } from '../../../interface/TableConfig';
import { ActivatedRoute } from '@angular/router';
import { TranslationMessageService } from '../../../services/translation-message-service';
import { DynamicTableComponent } from '../dynamic-table/dynamic-table.component';
import { SpinnerService } from '../../../services/spinner.service';

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

  tableToWait:string[] = [];

  constructor(private route: ActivatedRoute, private translationService: TranslationMessageService, private spinnerService: SpinnerService) {
  }

  async ngOnInit(): Promise<void> {
    this.spinnerService.show("multi-dynamic-tables.translateTable");
      this.route.data.subscribe((data) => {
        this.multiTable = data['multiTable'];
        this.excludedColumnsToTranslate = data['excludedColumnsToTranslate']
      });

      this.multiTable.forEach(async table => {
        this.tableToWait.push(table.id);
        if(table.title){
          table.title = await this.translationService.translate(table.title);
        }
      });
  }

  onLoaderComplete(tableId:string){
    this.tableToWait = this.tableToWait.filter(id => id !== tableId);
    if(this.tableToWait.length === 0){
      this.spinnerService.hide("multi-dynamic-tables.translateTable");
    }
  }
}