import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService  {

  private breakpointChangeSubject = new Subject<boolean>();
  private currentBreakpoint: string = '';
  private breakpointMap = new Map<string, string>([
    [Breakpoints.Handset, 'Handset'], // Smartphone
    [Breakpoints.Tablet, 'Tablet'],   // Tablet
    [Breakpoints.Web, 'Web'],         // Desktop
    ['(max-width: 599.98px) and (orientation: portrait)', 'HandsetPortrait'], // Smartphone in portrait
    ['(min-width: 600px) and (max-width: 959.98px)', 'SmallTablet'], // Tablet piccolo
    ['(min-width: 960px) and (max-width: 1279.98px)', 'LargeTablet'], // Tablet grande
    ['(min-width: 1280px)', 'LargeScreen'] // Desktop o schermo grande
  ]);

  public isMobile: boolean = false;
  public firstInit: boolean = true;

  constructor(private breakpointObserver: BreakpointObserver, private toastService: ToastService) {
    this.initBreakpointListener();
  }


  private initBreakpointListener() {
    this.breakpointObserver.observe(Array.from(this.breakpointMap.keys())).pipe(
      map((state: BreakpointState) => this.mapBreakpointState(state))
    ).subscribe((breakpoint: string) => {
      if (this.currentBreakpoint !== breakpoint) {
        this.currentBreakpoint = breakpoint;
        this.isMobile = breakpoint === 'Handset' || breakpoint === 'HandsetPortrait';
        if (this.firstInit) {
          this.firstInit = false;
        }else{
          this.toastService.showInfo('Breakpoint changed to: ' + breakpoint);
        }
        
        console.log('Breakpoint changed to: ', breakpoint);
        this.breakpointChangeSubject.next(this.isMobile);
      }
    });
  }

  private mapBreakpointState(state: BreakpointState): string {
    for (const [query, alias] of this.breakpointMap) {
      if (state.breakpoints[query]) {
        return alias;
      }
    }
    return 'Unknown';
  }

  getIsMobile(): boolean {
    return this.isMobile;
  }

  // Metodo a cui i componenti possono sottoscriversi per ricevere aggiornamenti di breakpoint
  subscribeToBreakpointChanges(): Observable<boolean> {
    return this.breakpointChangeSubject.asObservable();
  }

}
