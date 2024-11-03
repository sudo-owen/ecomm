import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="px-4 lg:px-6 h-14 flex items-center justify-between align-left space-x-4">
      <a class="flex items-center justify-center" routerLink="/">
        <svg
          viewBox="0 0 60 60"
          width="32"
          height="32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="premium-base"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" style="stop-color:#475569;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#334155;stop-opacity:1" />
            </linearGradient>
            <linearGradient
              id="premium-accent"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" style="stop-color:#EAB308;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#FDE047;stop-opacity:1" />
            </linearGradient>
          </defs>

          <circle cx="30" cy="30" r="28" fill="url(#premium-base)" />

          <!-- Outer golden ratio circle -->
          <path
            d="M30 15
           A15 15 0 0 1 45 30
           A15 15 0 0 1 30 45
           A15 15 0 0 1 15 30
           A15 15 0 0 1 30 15Z"
            fill="none"
            stroke="url(#premium-accent)"
            stroke-width="1.5"
          />

          <!-- Inner golden circle -->
          <path
            d="M30 20
           A10 10 0 0 1 40 30
           A10 10 0 0 1 30 40
           A10 10 0 0 1 20 30
           A10 10 0 0 1 30 20Z"
            fill="url(#premium-accent)"
            opacity="0.9"
          />

          <!-- Center dot -->
          <circle cx="30" cy="30" r="3" fill="url(#premium-base)" />
        </svg>
        <div class="font-bold text-xl letters-tight">
          Center
        </div>
      </a>
      <nav class="flex gap-4 sm:gap-6">
        <a
          class="font-medium hover:underline underline-offset-4 font-semibold"
          routerLink="/products"
          >Products</a
        >
      </nav>
      <nav>
        <!-- spacer -->
      </nav>
    </header>
  `,
})
export class HeaderComponent {}
