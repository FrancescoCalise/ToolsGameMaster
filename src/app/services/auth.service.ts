// auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, User, signInWithPopup, GoogleAuthProvider, signOut, UserCredential } from '@angular/fire/auth';
import { Role, RoleType } from '../interface/roles';
import { BehaviorSubject, Observable } from 'rxjs';
import { CacheStorageService } from './cache-storage.service';
import { SpinnerService } from './spinner.service';
import { Router } from '@angular/router';

export interface PersonalUser {
  displayName: string | null;
  email: string | null;
  uid: string;
  emailVerified: boolean;
  photoURL: string | null;
  isAnonymous: boolean;
  role: RoleType;
  lastDonation: Date | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  roleType: RoleType | null = null;
  protected user: PersonalUser | null = null;
  private userSubject: BehaviorSubject<PersonalUser | null>;
  public user$: Observable<PersonalUser | null>;

  public isInLogin: boolean = false;
  public isLoginCompleted: boolean = false;
  lastDonationDate: Date | undefined;

  constructor(
    private auth: Auth,
    private cacheService: CacheStorageService,
    private spinner: SpinnerService,
    private router: Router
  ) {
      this.userSubject = new BehaviorSubject<PersonalUser | null>(null);
      this.user$ = this.userSubject.asObservable();
  }

  // Login con Google
  async loginWithGoogle(): Promise<UserCredential> {
    try {
      let user = await signInWithPopup(this.auth, new GoogleAuthProvider());
      this.spinner.showSpinner();
      let partialUser = this.mapFirebaseUser(user.user);
      this.userSubject.next(partialUser);
      this.isInLogin = true;
      console.log('Partial Login con Google effettuato con successo');
      return user;
    } catch (error) {
      console.error('Errore durante il login con Google: ', error);
      throw new Error('Errore durante il login con Google');
    }
  }
  
  public setExtraInformation(roleType: RoleType, lastDonation?: Date){
    this.roleType = roleType;
    this.lastDonationDate = lastDonation;
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
    try {
      this.spinner.showSpinner();
      await signOut(this.auth);
      this.isInLogin = false;
      this.isLoginCompleted = false;
      this.userSubject.next(null);
      this.cacheService.removeItem(this.cacheService.userInfoKey);
      this.router.navigateByUrl('/login');
      console.log('Logout effettuato con successo');
    } catch (error) {
      console.error('Errore durante il logout: ', error);
    }
  }

  public isAuthLoginCompleted(): boolean {
    return this.isLoginCompleted;
  }

  public getCurrentUser(): PersonalUser | null {
    return this.userSubject.value;
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

  public setFromCache(user: PersonalUser){
   if(user){
    let role = user.role;
    this.setExtraInformation(role);
    this.user = user;
    
    this.completeLogin();
   }
  }

  public updateLastDonationDate(date: Date){
    if(this.user){
      this.user.lastDonation = date;
      this.cacheService.setItem(this.cacheService.userInfoKey, this.user);
      this.userSubject.next(this.user);
    }
  }
}