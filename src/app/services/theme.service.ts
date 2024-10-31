// theme.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppTheme } from '../models/themes';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  static defaultTheme: AppTheme = {
    heroSection: {
      container: 'w-full py-12 md:py-24 lg:py-32 xl:py-48',
      headingText: 'text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none',
      subText: 'text-gray-600 dark:text-gray-400',
      ctaButton: 'inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-white',
      imageContainer: 'mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full'
    },
    featureCard: {
      container: 'bg-white rounded-lg shadow-md p-6',
      icon: 'h-12 w-12 text-primary',
      title: 'text-xl font-bold',
      description: 'text-gray-600 h-24',
      image: 'aspect-square object-cover w-full rounded-lg',
    },
    testimonialCard: {
      container: 'bg-white rounded-lg shadow-md',
      starIcon: 'w-5 h-5 fill-primary text-primary',
      quote: 'text-gray-600',
      authorContainer: 'flex items-center space-x-2',
      authorName: 'font-semibold',
      authorTitle: 'text-gray-500'
    },
    productCard: {
      container: 'bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300',
      title: 'text-lg font-bold mt-2',
      description: 'text-gray-600',
      price: 'text-lg font-bold',
      ctaButton: 'border rounded-md px-4 py-2 text-sm'
    },
    productHolder: {
      container: 'grid gap-6 md:grid-cols-2 lg:grid-cols-3',
      numItems: 3
    }
  };

  currentTheme = new BehaviorSubject<AppTheme>(ThemeService.defaultTheme);
  currentTheme$ = this.currentTheme.asObservable();

  setTheme(theme: Partial<AppTheme>) {
    this.currentTheme.next({
      ...this.currentTheme.value,
      ...theme
    });
  }

  setDarkTheme() {
    const darkTheme: Partial<AppTheme> = {
      heroSection: {
        ...ThemeService.defaultTheme.heroSection,
        container: 'w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-900',
        headingText: 'text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white',
        subText: 'text-gray-300'
      },
      featureCard: {
        ...ThemeService.defaultTheme.featureCard,
        container: 'bg-gray-800 rounded-lg shadow-md p-6',
        title: 'text-xl font-bold text-white',
        description: 'text-gray-300'
      },
      // Add dark theme variations for other components...
    };
    this.setTheme(darkTheme);
  }
}