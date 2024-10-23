import { Firestore, collection, query, where, doc, getDoc, getDocs, addDoc, setDoc, deleteDoc, serverTimestamp, QueryFieldFilterConstraint } from '@angular/fire/firestore';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BaseDocument } from '../interface/models';
import { AuthService, PersonalUser } from './auth.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService<T extends BaseDocument> implements OnInit, OnDestroy {
  private collectionName!: string;
  private user: PersonalUser | null = null;
  private userSubscription!: Subscription

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.user = user;
    });
    
    if(!this.user)
      this.user = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  setCollectionName(collectionName: string) {
    this.collectionName = collectionName;
  }

  async getItems(): Promise<T[]> {
    const colRef = collection(this.firestore, this.collectionName);
    const q = query(colRef, where('ownerId', '==', this.user?.uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[];
  }

  async getItem(id: string): Promise<T | null> {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    try{
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as T) : null;
    }catch(e){
      throw new Error('Error getting item: ' + e);
    }
  }

  async getItemsWhere(where: QueryFieldFilterConstraint): Promise<T[]> {
    const colRef = collection(this.firestore, this.collectionName);
    const q = query(colRef, where);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[];
  }

  async addItem(item: T, forceId?:string): Promise<boolean> {
    try {
      const colRef = collection(this.firestore, this.collectionName);
      item.ownerId = this.user?.uid;
      item.creationDate = serverTimestamp();
      item.lastUpdateDate = serverTimestamp();
      let haveId = forceId !== undefined;
      let docRef:any = null;

      if(haveId){
        docRef = doc(colRef, forceId)
      }else{
        docRef = doc(colRef);
      }
      if(docRef === null) throw new Error('Error adding item: docRef is null');

      await setDoc(docRef,{...item});
      return true;
    } catch (e) {
      console.error('Error adding item: ', e);
      return false;
    }
  }

  async updateItem(item: T): Promise<boolean> {
    item.lastUpdateDate = serverTimestamp();
    const docRef = doc(this.firestore, `${this.collectionName}/${item.id}`);
    try {
      await setDoc(docRef, item);
      return true;
    } catch (e) {
      console.error('Error updating item: ', e);
      return false;
    }
  }

  async deleteItem(id: string): Promise<boolean> {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    try {
      await deleteDoc(docRef);
      return true;
    } catch (e) {
      console.error('Error deleting item: ', e);
      return false;
    }
  }
}
