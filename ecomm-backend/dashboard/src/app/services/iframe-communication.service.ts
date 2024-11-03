import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { SelectedElement } from '../models/selected-element.interface';

@Injectable({
  providedIn: 'root',
})
export class IframeCommunicationService {
  private readonly selectionScript = `...`; // Move script here
  private elementSelectedSubject = new Subject<SelectedElement>();
  elementSelected$ = this.elementSelectedSubject.asObservable();

  constructor(private sanitizer: DomSanitizer) {}

  getIframeUrl(): SafeResourceUrl {
    const blob = new Blob([this.selectionScript], { type: 'text/javascript' });
    const scriptUrl = URL.createObjectURL(blob);
    const url = new URL('http://localhost:4200');
    url.searchParams.set('selector_script', scriptUrl);
    return this.sanitizer.bypassSecurityTrustResourceUrl(url.toString());
  }

  sendMessageToIframe(message: any) {
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(message, '*');
    }
  }

  handleIframeMessage(event: MessageEvent) {
    if (event.origin !== 'http://localhost:4200') return;
    if (event.data.type === 'ELEMENT_SELECTED') {
      this.elementSelectedSubject.next(event.data.payload);
    }
  }
}
