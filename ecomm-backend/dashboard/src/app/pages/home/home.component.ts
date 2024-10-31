import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Experiment {
  id: number;
  name: string;
  progress: number;
  conversions: number;
  impressions: number;
}

interface OverallMetrics {
  totalExperiments: number;
  activeExperiments: number;
  totalConversions: number;
  overallConversionRate: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  activeExperiments: Experiment[] = [
    {
      id: 1,
      name: 'Button Color Test',
      progress: 65,
      conversions: 1200,
      impressions: 10000,
    },
    {
      id: 2,
      name: 'Landing Page Layout',
      progress: 30,
      conversions: 800,
      impressions: 8000,
    },
    {
      id: 3,
      name: 'Pricing Model Test',
      progress: 80,
      conversions: 1500,
      impressions: 12000,
    },
  ];

  overallMetrics: OverallMetrics = {
    totalExperiments: 10,
    activeExperiments: 3,
    totalConversions: 15000,
    overallConversionRate: 5.2,
  };

  getConversionRate(conversions: number, impressions: number): string {
    return ((conversions / impressions) * 100).toFixed(2);
  }
}
