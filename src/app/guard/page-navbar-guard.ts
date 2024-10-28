// page-navbar.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NavbarService } from '../services/navbar-service';

@Injectable({
  providedIn: 'root'
})
export class PageNavbarGuard implements CanActivate, CanDeactivate<unknown> {
  
  constructor(private navbarService: NavbarService) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const imgRoot = route.data['imgRoot'];
    const rootTitle = route.data['rootTitle'];
    const cssTitleRoot = route.data['cssTitleRoot'];

    // Imposta i valori tramite il servizio
    this.navbarService.setImgLogoGame(imgRoot);
    this.navbarService.setCssTitleRoot(cssTitleRoot);
    await this.navbarService.setGameTitle(rootTitle);
    return true;
  }

  canDeactivate(): boolean {
    this.navbarService.resetNavbar();
    return true;
  }
}
