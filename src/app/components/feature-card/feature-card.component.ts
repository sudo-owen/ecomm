import { Component, Input } from "@angular/core";
import { Observable } from "rxjs";
import { AppTheme } from "../../models/themes";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-feature-card',
  template: `
    <div [ngClass]="(theme$ | async)?.featureCard?.container">
      <div class="flex flex-col items-center space-y-2 p-6">
        <h3 [ngClass]="(theme$ | async)?.featureCard?.title">
          <ng-content select="[title]"></ng-content>
        </h3>
        <p [ngClass]="(theme$ | async)?.featureCard?.description">
          <ng-content select="[description]"></ng-content>
        </p>
        <img [src]="imageSrc" [alt]="imageAlt" [ngClass]="(theme$ | async)?.featureCard?.image">
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class FeatureCardComponent {
  @Input() imageSrc: string = '';
  @Input() imageAlt: string = '';
  @Input() theme$!: Observable<AppTheme>;
  
  constructor() {}
}