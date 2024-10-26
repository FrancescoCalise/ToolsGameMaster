import { Injectable } from '@angular/core';
import { Auth, User, signInWithPopup, GoogleAuthProvider, signOut, UserCredential } from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { CacheStorageService } from './cache-storage.service';
import { SpinnerService } from './spinner.service';
import { Router } from '@angular/router';
import { Timestamp } from 'firebase/firestore';
import { RoleType, UserInformationSaved } from '../interface/Document/UserInformationSaved';

export interface PersonalUser {
  displayName: string | null;
  email: string | null;
  uid: string;
  emailVerified: boolean;
  photoURL: string | null;
  isAnonymous: boolean;
  role: RoleType;
  lastDonation: Timestamp | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  roleType: RoleType | null = null;
  protected user: PersonalUser | null = null;
  private userSubject: BehaviorSubject<PersonalUser | null>;

  public isInLogin: boolean = false;
  public isLoginCompleted: boolean = false;
  lastDonationDate: Timestamp | null = null;

  constructor(
    private auth: Auth,
    private cacheService: CacheStorageService,
    private spinner: SpinnerService,
    private router: Router
  ) {
    this.userSubject = new BehaviorSubject<PersonalUser | null>(null); // Utilizziamo BehaviorSubject
  }

  // Login con Google
  async loginWithGoogle(): Promise<UserCredential> {
    try {
      let user = await signInWithPopup(this.auth, new GoogleAuthProvider());
      this.spinner.showSpinner();
      let partialUser = this.mapFirebaseUser(user.user);
      this.userSubject.next(partialUser);
      this.isInLogin = true;
      return user;
    } catch (error) {
      throw error;
    }
  }

  public setExtraInformation(user: UserInformationSaved) {
    this.roleType = user.role;
    this.lastDonationDate = user.lastDonation != null ? user.lastDonation as Timestamp : null;
    this.user = this.mapFirebaseUser(this.auth.currentUser);
  }

  public completeLogin() {
    this.isInLogin = false;
    this.isLoginCompleted = true;
    this.cacheService.setItem(this.cacheService.userInfoKey, this.user);
    this.userSubject.next(this.user);
    this.spinner.hideSpinner();
  }

  // Logout
  async logout(): Promise<void> {

    this.spinner.showSpinner();
    await signOut(this.auth);
    this.isInLogin = false;
    this.isLoginCompleted = false;
    this.userSubject.next(null);
    this.cacheService.removeItem(this.cacheService.userInfoKey);
    this.router.navigateByUrl('/login');

  }

  public isAuthLoginCompleted(): boolean {
    return this.isLoginCompleted;
  }

  public getCurrentUser(): PersonalUser | null {
    if (!this.user) {
      let cachedUser = this.cacheService.getItem(this.cacheService.userInfoKey);
      if (cachedUser) {
        this.setFromCache(cachedUser);
      }
    }
    return this.user;
  }

  private mapFirebaseUser(user: User | null): PersonalUser | null {
    if (!user) return null;
    let roleType = this.roleType ? this.roleType : RoleType.User;
    let lastDonation = this.lastDonationDate ? this.lastDonationDate : null;
    return {
      displayName: user.displayName,
      email: user.email,
      uid: user.uid,
      emailVerified: user.emailVerified,
      photoURL: user.photoURL,
      isAnonymous: user.isAnonymous,
      role: roleType,
      lastDonation: lastDonation
    };
  }

  public setFromCache(user: PersonalUser) {
    if (user) {
      let userInformationSaved: UserInformationSaved = {
        role: user.role,
        email: user.email as string,
        lastDonation: user.lastDonation
      }
      this.setExtraInformation(userInformationSaved);
      this.user = user;
      this.completeLogin();
    }
  }

  public updateLastDonationDate(date: Date) {
    if (this.user) {
      let seconds = Math.floor(date.getTime() / 1000);
      let timeStamp = new Timestamp(seconds, 0);
      this.user.lastDonation = timeStamp;
      this.cacheService.setItem(this.cacheService.userInfoKey, this.user);
      this.userSubject.next(this.user);
    }
  }

  // Metodo a cui i componenti possono sottoscriversi per ricevere aggiornamenti
  subscribeToUserChanges(): Observable<PersonalUser | null> {
    return this.userSubject.asObservable();
  }
}
