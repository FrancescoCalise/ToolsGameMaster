import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';

import { DynamicTableComponent } from '../../../dynamic-table/dynamic-table.component';
import { FeatureAreaComponent } from '../../feature-sitemap/feature-area.component';
import { GameBaseComponent } from '../base/game-base.component';
import { dnd5eConfig } from './dnd-5e-config';

@Component({
  selector: 'app-game-dugeon-and-dragons-5e',
  templateUrl: './dungeonanddragons5e.component.html',
  styleUrls: ['./dungeonanddragons5e.component.css'],
  standalone: true,
  imports: [
    SharedModule,
    DynamicTableComponent,
    FeatureAreaComponent,
    RouterOutlet,
  ],
  providers: [
    FeatureAreaComponent,
  ]
})
export class DungeonAndDragons5eComponent extends GameBaseComponent implements OnInit {
  
  override async ngOnInit(): Promise<void> {
    this.gameConfig = dnd5eConfig;
    await super.ngOnInit();
  }

}
