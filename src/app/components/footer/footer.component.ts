import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer
      class="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t"
    >
      <p class="text-xs text-muted-foreground">
<<<<<<< HEAD
        © 2024 Center Clothing Company (CCC)
=======
        © 2024 Triple DDD. All rights reserved.
>>>>>>> 6e4cb26 (ab_testing_engine)
      </p>
    </footer>
  `,
})
export class FooterComponent {}
