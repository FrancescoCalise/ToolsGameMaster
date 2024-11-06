import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
    name: 'safeUrl',
    standalone: true
})
@Injectable({
    providedIn: 'root',
})
export class SafeUrlPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}

    transform(url: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}
