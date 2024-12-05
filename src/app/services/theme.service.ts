// theme.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { AppTheme } from '../models/themes';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  currentTheme: BehaviorSubject<AppTheme>;
  currentTheme$: Observable<AppTheme>;

  constructor(private api: ApiService) {
    this.currentTheme = new BehaviorSubject<AppTheme>({} as AppTheme);
    this.currentTheme$ = this.currentTheme.asObservable();
  }

  init() {
    return this.api.getTheme().pipe(
      map((theme) => {
        this.currentTheme.next(theme);
        return true;
      }),
      catchError(() => of(false))
    );
  }

  getSessionId(): string | null {
    return this.api.getSessionId();
  }
}