import { Component,EventEmitter,Inject,OnDestroy,OnInit, Output } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SessionManager } from '../../interface/Document/SessionManager';
import { ActivatedRoute } from '@angular/router';
import { CacheStorageService } from '../../services/cache-storage.service';
import { QueryFieldFilterConstraint, where } from 'firebase/firestore';
import { FirestoreService } from '../../services/firestore.service';
import { SESSION_MANAGER_SERVICE } from '../../firebase-provider';

@Component({
  selector: 'app-session-manager-widget',
  templateUrl: './session-manager-widget.component.html',
  styleUrl: './session-manager-widget.component.css',
  standalone: true,
  imports: [
    SharedModule,
  ]
})

export class SessionManagerWidgetComponent implements OnInit, OnDestroy {
  defaultSession: SessionManager = {
    sessionName: '',
    gameName: '',
    default: false
  };
  gameName = '';
  @Output() sessionLoaded = new EventEmitter<SessionManager>()

  constructor(
    private route: ActivatedRoute,
    private cacheService: CacheStorageService,
    @Inject(SESSION_MANAGER_SERVICE) private firestoreSessionManagerService: FirestoreService<SessionManager>
  ) { 
    
  }

  ngOnDestroy(): void {
    
  }

  async ngOnInit(): Promise<void> {
    this.route.parent?.data.subscribe(data => {
      this.gameName = data['gameName'];
    });
    if (!this.gameName) {
      throw new Error('route is not properly configured');
    }
    await this.setDefaultSession();
  }

  async setDefaultSession(): Promise<void> {
    
    let defaultSession = this.cacheService.getItem(this.cacheService.defaultSession) as SessionManager;
    if (!defaultSession) {
      let whereConditions: QueryFieldFilterConstraint[] = [];
      whereConditions.push(where('gameName', '==', this.gameName));
      whereConditions.push(where('default', '==', true));

      let sessions = await this.firestoreSessionManagerService.getItemsWhere(whereConditions);
      if (sessions && sessions.length > 0) {
        defaultSession = sessions[0];
        this.cacheService.setItem(this.cacheService.defaultSession, defaultSession);
      }else{
        this.defaultSession = {
          sessionName: '',
          gameName: '',
          default: false
        };
      }
    }
    this.defaultSession = defaultSession;
    this.sessionLoaded.emit(this.defaultSession)
  }

}
