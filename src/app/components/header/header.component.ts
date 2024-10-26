import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="px-4 lg:px-6 h-14 flex items-center align-left space-x-4">
      <a class="flex items-center justify-center" routerLink="/">
        <svg
          class="h-8 w-8"
          fill="#000000"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 60 60"
          xml:space="preserve"
        >
          <path
            d="M59,41H42c-6.065,0-11-4.935-11-11s4.935-11,11-11h14.586l-6.293,6.293c-0.391,0.391-0.391,1.023,0,1.414
          C50.488,26.902,50.744,27,51,27s0.512-0.098,0.707-0.293l7.999-7.999c0.093-0.092,0.166-0.203,0.217-0.326
          c0.101-0.244,0.101-0.519,0-0.764c-0.051-0.123-0.125-0.234-0.217-0.326l-7.999-7.999c-0.391-0.391-1.023-0.391-1.414,0
          s-0.391,1.023,0,1.414L56.586,17H42c-5.4,0-10.039,3.311-12,8.008C28.039,20.311,23.4,17,18,17H1c-0.553,0-1,0.447-1,1s0.447,1,1,1
          h17c6.065,0,11,4.935,11,11s-4.935,11-11,11H3.414l6.293-6.293c0.391-0.391,0.391-1.023,0-1.414s-1.023-0.391-1.414,0l-7.999,7.999
          c-0.093,0.092-0.166,0.203-0.217,0.326c-0.101,0.244-0.101,0.52,0,0.764c0.051,0.123,0.124,0.234,0.217,0.326l7.999,7.999
          C8.488,50.902,8.744,51,9,51s0.512-0.098,0.707-0.293c0.391-0.391,0.391-1.023,0-1.414L3.414,43H18c5.4,0,10.039-3.311,12-8.008
          C31.961,39.689,36.6,43,42,43h17c0.553,0,1-0.447,1-1S59.553,41,59,41z"
          />
        </svg>
        <span class="sr-only">Ergo Chairs Co.</span>
      </a>
      <nav class="flex gap-4 sm:gap-6">
        <a
          class="text-sm font-medium hover:underline underline-offset-4"
          routerLink="/products"
          >Products</a
        >
      </nav>
    </header>
  `,
})
export class HeaderComponent {}
