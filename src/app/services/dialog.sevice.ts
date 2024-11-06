import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    width: string = '90vw';
    minHeight: string = '200px'; // Altezza minima per la dialog
    maxWidth: string = '90vw';
    maxHeight: string = '80vh'; // Limita l’altezza massima all’80% dell’altezza visibile
    panelClass: string = '';

    constructor(private matDialog: MatDialog) { }

    public open(component: any, config: MatDialogConfig = {}): MatDialogRef<any> {

        let dialogConfig = {};
        if (config.panelClass) {
            dialogConfig = {
                panelClass: config.panelClass,
                ...config
            }
        } else {
            dialogConfig = {
                width: config.width ? config.width : this.width,
                maxWidth: config.maxWidth ? config.maxWidth : this.maxWidth,
                maxHeight: config.maxHeight ? config.maxHeight : this.maxHeight,
                minHeight: config.minHeight ? config.minHeight : this.minHeight,
                
                ...config
            };
        }
        return this.matDialog.open(component, dialogConfig);
    }



}