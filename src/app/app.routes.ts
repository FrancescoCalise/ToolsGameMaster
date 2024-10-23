import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { HomeComponent } from './component/home/home.component'; // Assicurati di importare HomeComponent
import { authGuard } from './guard/auth.guard';
import { NotFoundComponent } from './component/notFoud/not-found.component';
import { ItemListComponent } from './component/item-list/item-list.component';
import { ItemFormComponent } from './component/item-form/item-form.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  
  { path: 'items', component: ItemListComponent, canActivate: [authGuard] },
  { path: 'add-item', component: ItemFormComponent, canActivate: [authGuard] },
  // Aggiungi qui altre rotte protette

  // Questa rotta deve essere sempre alla fine
  { path: '**', component: NotFoundComponent},
];
