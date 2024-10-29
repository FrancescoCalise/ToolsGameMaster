import { AfterViewInit, Component, Inject, OnInit, } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ToastService } from '../../services/toast.service';
import { ActivatedRoute } from '@angular/router';
import { SessionManager } from '../../interface/Document/SessionManager';
import { SESSION_MANAGER_SERVICE } from '../../firebase-provider';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService, PersonalUser } from '../../services/auth.service';
import { QueryFieldFilterConstraint, where } from 'firebase/firestore';
import { SpinnerService } from '../../services/spinner.service';
import { CacheStorageService } from '../../services/cache-storage.service';

@Component({
  selector: 'app-session-manger',
  templateUrl: './session-manger.component.html',
  styleUrl: './session-manger.component.css',
  standalone: true,
  imports: [
    SharedModule,
  ]
})

export class SessionManagerComponenet implements OnInit, AfterViewInit {

  public gameName = '';
  private user?: PersonalUser;
  public sessions: SessionManager[] = [];
  newSession: SessionManager = {};
  showForm: boolean = false;
  editingSession: boolean = false;

  defaultSession: SessionManager = {};

  constructor(
    private toastService: ToastService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private cacheService: CacheStorageService,
    @Inject(SESSION_MANAGER_SERVICE) private firestoreSessionManagerService: FirestoreService<SessionManager>

  ) { }

  ngAfterViewInit(): void {
    this.spinnerService.hideSpinner();
  }

  async ngOnInit(): Promise<void> {
    this.spinnerService.showSpinner();

    this.route.parent?.data.subscribe(data => {
      this.gameName = data['gameName'];
    });
    if (!this.gameName) {
      throw new Error('route is not properly configured');
    }

    this.user = this.authService.getCurrentUser() as PersonalUser;

    this.firestoreSessionManagerService.setCollectionName('session-manager');
    await this.loadAllSessionManagers();
    this.spinnerService.hideSpinner();
  }

  async loadAllSessionManagers() {
    let whereConditions: QueryFieldFilterConstraint[] = [];
    whereConditions.push(where('gameName', '==', this.gameName));

    var sessionManagers = await this.firestoreSessionManagerService.getItemsWhere(whereConditions);
    this.sessions = sessionManagers;
    if (this.sessions.length > 0) {
      var defaultSession = this.sessions.find(s => s.default);
      if (defaultSession) {
        this.cacheService.setItem('defaultSession', defaultSession);
      }
    }
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.editingSession) {
      this.newSession = {}; // Reset form when opening or closing if not editing
    }
    this.editingSession = false;
  }

  async createNewSession(): Promise<void> {
    if (this.editingSession) {
      const index = this.sessions.findIndex(session =>
        session.id === this.newSession.id &&
        session.gameName === this.gameName &&
        session.ownerId === this.user?.uid);

      if (index !== -1) {
        this.sessions[index] = { ...this.newSession };
        await this.firestoreSessionManagerService.updateItem(this.newSession);
      }
    } else {
      if (this.newSession.sessionName) {
        this.newSession.gameName = this.gameName;
        await this.firestoreSessionManagerService.addItem(this.newSession);
        this.sessions.push({ ...this.newSession });
      }
    }
    this.toggleForm();
  }

  editSession(session: SessionManager): void {
    this.newSession = { ...session };
    this.editingSession = true;
    this.showForm = true;
  }

  async deleteSession(session: SessionManager): Promise<void> {
    this.sessions = this.sessions.filter(s => s.id !== session.id);

    await this.firestoreSessionManagerService.deleteItem(session.id as string);
  }

  async setAsDefault(session: SessionManager): Promise<void> {
    this.defaultSession = session;
    this.cacheService.setItem('defaultSession', session);
    session.default = true;
    await this.firestoreSessionManagerService.updateItem(session);

    this.sessions.forEach(s => {
      if (s.id !== session.id) {
        s.default = false;
        this.firestoreSessionManagerService.updateItem(s);
      }
    });
  }

}
