import { Component } from '@angular/core';
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
export class ExperimentsListComponent {
  allExperiments: Experiment[] = []
  /*
    {
      id: 1,
      name: 'Button Color Test',
      status: 'Active',
      startDate: '2023-05-01',
      endDate: '2023-05-31',
      description: 'Testing button color variations',
      conversions: 1200,
      impressions: 10000,
      variants: [],
    },
    {
      id: 2,
      name: 'Landing Page Layout',
      status: 'Active',
      startDate: '2023-05-15',
      endDate: '2023-06-15',
      description: 'Testing different landing page layouts',
      conversions: 800,
      impressions: 8000,
      variants: [],
    },
    {
      id: 3,
      name: 'Pricing Model Test',
      status: 'Active',
      startDate: '2023-06-01',
      endDate: '2023-06-30',
      description: 'Testing various pricing models',
      conversions: 1500,
      impressions: 12000,
      variants: [],
    },
    {
      id: 4,
      name: 'Email Subject Line Test',
      status: 'Completed',
      startDate: '2023-04-01',
      endDate: '2023-04-30',
      description: 'Testing email subject line variations',
      conversions: 2000,
      impressions: 20000,
      variants: [],
    },
    {
      id: 5,
      name: 'Checkout Process Test',
      status: 'Completed',
      startDate: '2023-03-15',
      endDate: '2023-04-15',
      description: 'Testing streamlined checkout process',
      conversions: 1800,
      impressions: 15000,
      variants: [],
    },
  ];
  */

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

  getConversionRate(conversions: number, impressions: number): string {
    return ((conversions / impressions) * 100).toFixed(2);
  }
}
