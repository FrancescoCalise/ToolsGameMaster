import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    width: string = '90vw';
    height: string = 'auto';
    maxWidth: string = '90vw';
    maxHeight: string = '90vh';
    panelClass: string = '';

    constructor(private matDialog: MatDialog) { }

    public open(component: any, config: MatDialogConfig = {}): MatDialogRef<any> {

        const dialogConfig = {
            width: config.width ? config.width : this.width,
            height: config.height ? config.height : this.height,
            maxWidth: config.maxWidth ? config.maxWidth : this.maxWidth,
            maxHeight: config.maxHeight ? config.maxHeight : this.maxHeight,
            panelClass: config.panelClass ? config.panelClass : this.panelClass,
            ...config
        };
        return this.matDialog.open(component, dialogConfig);
    }



}