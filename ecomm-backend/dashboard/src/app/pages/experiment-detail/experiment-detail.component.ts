import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';
import { Experiment } from '../../models/experiment.interface';


@Component({
  selector: 'app-experiment-detail',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './experiment-detail.component.html',
  styleUrl: './experiment-detail.component.css',
})
export class ExperimentDetailComponent implements OnInit {
  icons = { ArrowLeft };
  experimentData: Experiment = {
    id: 1,
    name: 'Button Color Test',
    status: 'Active',
    startDate: '2023-05-01',
    endDate: '2023-05-31',
    description:
      'Testing the impact of different button colors on click-through rates.',
    variants: [
      { name: 'Control (Blue)', impressions: 5000, conversions: 500 },
      { name: 'Variant A (Green)', impressions: 5000, conversions: 600 },
    ],
    impressions: 10000,
    conversions: 1100,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      // fetchExperimentData(id);
    });
  }

  calculateConversionRate(conversions: number, impressions: number): string {
    return ((conversions / impressions) * 100).toFixed(2);
  }

  goBack() {
    this.router.navigate(['/experiments']);
  }
}
