import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <p class="text-xs text-muted-foreground">© 2023 Ergo Chairs Co. All rights reserved.</p>
    </footer>
  `
})
export class FooterComponent {}