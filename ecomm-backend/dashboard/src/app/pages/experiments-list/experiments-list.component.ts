import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Experiment {
  id: number;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  conversions: number;
  impressions: number;
}

@Component({
  selector: 'app-experiments-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './experiments-list.component.html',
  styleUrls: ['./experiments-list.component.css']
})
export class ExperimentsListComponent {
  allExperiments: Experiment[] = [
    { id: 1, name: "Button Color Test", status: "Active", startDate: "2023-05-01", endDate: "2023-05-31", conversions: 1200, impressions: 10000 },
    { id: 2, name: "Landing Page Layout", status: "Active", startDate: "2023-05-15", endDate: "2023-06-15", conversions: 800, impressions: 8000 },
    { id: 3, name: "Pricing Model Test", status: "Active", startDate: "2023-06-01", endDate: "2023-06-30", conversions: 1500, impressions: 12000 },
    { id: 4, name: "Email Subject Line Test", status: "Completed", startDate: "2023-04-01", endDate: "2023-04-30", conversions: 2000, impressions: 20000 },
    { id: 5, name: "Checkout Process Test", status: "Completed", startDate: "2023-03-15", endDate: "2023-04-15", conversions: 1800, impressions: 15000 },
  ];

  getConversionRate(conversions: number, impressions: number): string {
    return ((conversions / impressions) * 100).toFixed(2);
  }
}