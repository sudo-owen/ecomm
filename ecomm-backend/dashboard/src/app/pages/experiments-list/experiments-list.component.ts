import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Experiment } from '../../models/experiment.interface';

@Component({
  selector: 'app-experiments-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './experiments-list.component.html',
  styleUrls: ['./experiments-list.component.css'],
})
export class ExperimentsListComponent implements OnInit {
  allExperiments: Experiment[] = []

  ngOnInit() {
    fetch('http://localhost:3000/api/ab-tests').then((response) => {
      response.json().then((data) => {
        try {
          data.forEach((experiment: any) => {
            experiment.product = JSON.parse(experiment.productBlob);
          });
        } catch (error) {
          console.log(error);
        }

        data = data.filter((experiment: any) => experiment.status === 'ongoing').sort(
          (a: any, b: any) => {
            return a.product.id - b.product.id;
          }
        )
        this.allExperiments = data;
      });
    });
  }

  getTotalVisits(experiment: any): number {
    return experiment.variants.reduce((total: number, variant: any) => total + variant.visits, 0);
  }

  getBestConversionRate(experiment: any): number {
    const rates = experiment.variants.map((variant: any) => 
      variant.visits > 0 ? (variant.conversions / variant.visits) * 100 : 0
    );
    return Math.max(...rates);
  }

  getDefaultConversionRate(experiment: any): number {
    // Mock implementation - replace with actual logic to get default rate
    return 2.0; // 2% as an example
  }
}
