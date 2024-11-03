import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { ProductService } from './services/product.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ThemeService } from './services/theme.service';

function initializeProductService(productService: ProductService) {
  return () => new Promise((resolve) => {
    productService.init().subscribe(success => {
      resolve(success);
    });
  });
}

function initializeThemeService(themeService: ThemeService) {
  return () => new Promise((resolve) => {
    themeService.init().subscribe(success => {
      resolve(success);
    });
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeProductService,
      multi: true,
      deps: [ProductService]
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeThemeService,
      multi: true,
      deps: [ThemeService]
    }
  ],
};
