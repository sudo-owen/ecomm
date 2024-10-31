import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Observable } from "rxjs";
import { Testimonial } from "../../models/interfaces";
import { AppTheme } from "../../models/themes";

// testimonial-card.component.ts
@Component({
  selector: 'app-testimonial-card',
  template: `
    <div [ngClass]="(theme$ | async)?.testimonialCard?.container">
      <div class="p-6">
        <div class="flex space-x-1 mb-2">
          <svg *ngFor="let star of testimonial.stars" 
               [ngClass]="(theme$ | async)?.testimonialCard?.starIcon"
               viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                  stroke="currentColor" 
                  stroke-width="2" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" />
          </svg>
        </div>
        <p [ngClass]="(theme$ | async)?.testimonialCard?.quote">
          {{ testimonial.quote }}
        </p>
        <div [ngClass]="(theme$ | async)?.testimonialCard?.authorContainer">
          <div>
            <div [ngClass]="(theme$ | async)?.testimonialCard?.authorName">
              {{ testimonial.author }}
            </div>
            <div [ngClass]="(theme$ | async)?.testimonialCard?.authorTitle">
              {{ testimonial.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    imports: [CommonModule],
    standalone: true
})
export class TestimonialCardComponent {
  @Input() testimonial!: Testimonial;
  @Input() theme$!: Observable<AppTheme>;
  constructor() {}
}