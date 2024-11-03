import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CartDrawerComponent } from './components/cart-drawer/cart-drawer.component';
import { ElementSelectionService } from './services/element-selection.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    CartDrawerComponent,
  ],
  template: `
    <div class="flex flex-col min-h-screen">
      <app-header></app-header>
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
    <app-cart-drawer></app-cart-drawer>
  `,
  providers: [ElementSelectionService],
})
export class AppComponent {
  constructor(private elementSelectionService: ElementSelectionService) {}

  ngOnInit() {
    window.addEventListener('message', (event) => {
      if (event.data.type === 'TOGGLE_SELECTION_MODE') {
        this.elementSelectionService.toggleSelectionMode(event.data.payload);
      }
    });
  }
}
