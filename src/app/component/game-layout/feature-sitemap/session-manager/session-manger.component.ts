import { Component, Inject, OnInit, } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { ToastService } from '../../../../services/toast.service';
import { ActivatedRoute } from '@angular/router';
import { SessionManager } from '../../../../interface/Document/SessionManager';
import { SESSION_MANAGER_SERVICE } from '../../../../firebase-provider';
import { FirestoreService } from '../../../../services/firestore.service';
import { AuthService, PersonalUser } from '../../../../services/auth.service';
import { QueryFieldFilterConstraint, where } from 'firebase/firestore';
import { SpinnerService } from '../../../../services/spinner.service';
import { CacheStorageService } from '../../../../services/cache-storage.service';
import { SharedFields } from '../../../../shared/shared-fields.module';

@Component({
  selector: 'app-session-manger',
  templateUrl: './session-manger.component.html',
  styleUrl: './session-manger.component.css',
  standalone: true,
  imports: [
    SharedModule,
    SharedFields
  ]
})

export class SessionManagerComponenet implements OnInit {

  public gameName = '';
  private user?: PersonalUser;
  public sessions: SessionManager[] = [];
  newSession: SessionManager = {
    sessionName: '',
    gameName: '',
    default: false
  };
  showForm: boolean = false;

  defaultSession: SessionManager = {
    sessionName: '',
    gameName: '',
    default: false
  };

  constructor(
    private toastService: ToastService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private cacheService: CacheStorageService,
    @Inject(SESSION_MANAGER_SERVICE) private firestoreSessionManagerService: FirestoreService<SessionManager>

  ) {
    this.firestoreSessionManagerService.setCollectionName('session-manager');
  }



  async ngOnInit(): Promise<void> {
    this.spinnerService.show("SessionManagerComponenet.ngOnInit");

    this.route.parent?.data.subscribe(data => {
      this.gameName = data['gameName'];
    });
    if (!this.gameName) {
      throw new Error('route is not properly configured');
    }

    this.user = this.authService.getCurrentUser() as PersonalUser;

    this.firestoreSessionManagerService.setCollectionName('session-manager');
    await this.loadAllSessionManagers();
    this.spinnerService.hide("SessionManagerComponenet.ngOnInit");
  }

  async loadAllSessionManagers() {
    let whereConditions: QueryFieldFilterConstraint[] = [];
    whereConditions.push(where('gameName', '==', this.gameName));

    var sessionManagers = await this.firestoreSessionManagerService.getItemsWhere(whereConditions);
    this.sessions = sessionManagers;
    if (this.sessions.length > 0) {
      var defaultSession = this.sessions.find(s => s.default);
      if (defaultSession) {
        this.cacheService.setItem(this.cacheService.defaultSession, defaultSession);
      }
    }
  }

  async createNewSession(): Promise<void> {
    const index = this.sessions.findIndex(session =>
      session.id === this.newSession.id &&
      session.gameName === this.gameName &&
      session.ownerId === this.user?.uid);

    if (index !== -1) {
      this.sessions[index] = { ...this.newSession };
      await this.firestoreSessionManagerService.updateItem(this.newSession);
        if (this.newSession.default) {
          this.cacheService.setItem(this.cacheService.defaultSession, this.newSession)
        };
    }else{
      if (this.newSession.sessionName) {

        if (this.sessions.length == 0) {
          this.newSession.default = true;
        }

        this.newSession.gameName = this.gameName;
        var id = await this.firestoreSessionManagerService.addItem(this.newSession);
        this.newSession.id = id;
        this.sessions.push({ ...this.newSession });
      }
    }

    this.toggleForm(false);
  }

  toggleForm(open:boolean){
    this.showForm = open;
    this.newSession = {
      sessionName: '',
      gameName: '',
      default: false
    }
  }

  editSession(session: SessionManager): void {
    this.newSession = { ...session };
    this.showForm = !this.showForm;
  }

  async deleteSession(session: SessionManager): Promise<void> {
    if (this.defaultSession.default) {
      this.cacheService.removeItem(this.cacheService.defaultSession);
    }

    this.sessions = this.sessions.filter(s => s.id !== session.id);

    await this.firestoreSessionManagerService.deleteItem(session.id as string);
  }

  async setAsDefault(session: SessionManager): Promise<void> {
    this.spinnerService.show("SessionManagerComponenet.setAsDefault");
    this.defaultSession = session;
    this.cacheService.setItem(this.cacheService.defaultSession, session);
    session.default = true;
    await this.firestoreSessionManagerService.updateItem(session);

    this.sessions.forEach(async s => {
      if (s.id !== session.id) {
        s.default = false;
        await this.firestoreSessionManagerService.updateItem(s);
      }
    })
    this.spinnerService.hide("SessionManagerComponenet.setAsDefault");
  }

}
