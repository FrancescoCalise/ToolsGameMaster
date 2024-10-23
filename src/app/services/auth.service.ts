// auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, User, signInWithPopup, GoogleAuthProvider, signOut, UserCredential } from '@angular/fire/auth';
import { Role, RoleType } from '../interface/roles';
import { BehaviorSubject, Observable } from 'rxjs';
import { CacheStorageService } from './cache-storage.service';

export interface PersonalUser {
  displayName: string | null;
  email: string | null;
  uid: string;
  emailVerified: boolean;
  photoURL: string | null;
  isAnonymous: boolean;
  role: RoleType;
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

  constructor(
    private auth: Auth,
    private cacheService: CacheStorageService) {
      this.userSubject = new BehaviorSubject<PersonalUser | null>(null);
      this.user$ = this.userSubject.asObservable();
  }

  // Login con Google
  async loginWithGoogle(): Promise<UserCredential> {
    try {
      let user = await signInWithPopup(this.auth, new GoogleAuthProvider());
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
  
  public setRoleType(roleType: RoleType) {
    this.roleType = roleType;
    this.user = this.mapFirebaseUser(this.auth.currentUser);
  }

  public completeLogin() {
    
    this.isInLogin = false;
    this.isLoginCompleted = true;
    this.cacheService.setItem(this.cacheService.userInfoKey, this.user);
    this.userSubject.next(this.user);
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.isInLogin = false;
      this.isLoginCompleted = false;
      this.userSubject.next(null);
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
    return {
      displayName: user.displayName,
      email: user.email,
      uid: user.uid,
      emailVerified: user.emailVerified,
      photoURL: user.photoURL,
      isAnonymous: user.isAnonymous,
      role: roleType
    };
  }

  public setFromCache(user: PersonalUser){
   if(user){
    let role = user.role;
    this.setRoleType(role);
    this.user = user;
    
    this.completeLogin();
   }
  }
}