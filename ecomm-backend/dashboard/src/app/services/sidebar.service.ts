import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private _isCollapsed = new BehaviorSubject<boolean>(false);
  isCollapsed$ = this._isCollapsed.asObservable();

  get isCollapsed(): boolean {
    return this._isCollapsed.value;
  }

  toggle() {
    this._isCollapsed.next(!this._isCollapsed.value);
  }
}
