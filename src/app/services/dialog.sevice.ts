import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    width: string = '90vw';
    maxWidth: string = '90vw';
    minWidth: string = '90vw'; // Larghezza minima per la dialog
    minHeight: string = '90vh'; // Altezza minima per la dialog
    maxHeight: string = '90vh'; // Limita l’altezza massima all’80% dell’altezza visibile
    height: string = '90vh'; // Altezza della dialog
    panelClass: string = '';

    constructor(private matDialog: MatDialog) { }

    public open(component: any, config: MatDialogConfig = {}): MatDialogRef<any> {
        let isMobile = window.innerWidth < 768;
        this.minHeight = isMobile ? '90vh' : '90vh';
        
        let dialogConfig = {};
        if (config.panelClass) {
            dialogConfig = {
                panelClass: config.panelClass,
                disableClose: true,
                ...config
            }
        } else {
            dialogConfig = {
                minWidth: config.minWidth ? config.minWidth : this.minWidth,
                width: config.width ? config.width : this.width,
                maxWidth: config.maxWidth ? config.maxWidth : this.maxWidth,
                maxHeight: config.maxHeight ? config.maxHeight : this.maxHeight,
                minHeight: config.minHeight ? config.minHeight : this.minHeight,
                height: config.height ? config.height : this.height,
                disableClose: true,
                ...config
            };
        }
        return this.matDialog.open(component, dialogConfig);
    }



}