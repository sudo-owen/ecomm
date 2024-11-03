import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';
import { ExperimentWithProduct } from '../../models/experiment.interface';

@Component({
  selector: 'app-experiment-detail',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './experiment-detail.component.html',
  styleUrl: './experiment-detail.component.css',
})
export class ExperimentDetailComponent implements OnInit {
  icons = { ArrowLeft };
  experimentData = {} as ExperimentWithProduct;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      fetch(`http://localhost:3000/api/ab-test/${id}`).then((response) => {
        response.json().then((data) => {
          this.experimentData = {
            ...data,
            product: JSON.parse(data.productBlob)
          };
        });
      });
    });
  }

  calculateConversionRate(conversions: number, impressions: number): number {
    if (impressions === 0) return 0;
    return (conversions / impressions) * 100;
  }

  goBack() {
    this.router.navigate(['/experiments']);
  }
  getChanges(changesString: string): Array<{key: string, value: any}> {
    try {
      const changesObj = JSON.parse(changesString);
      console.log(changesObj);
      return Object.entries(changesObj).map(([key, value]) => ({ key, value }));
    } catch (error) {
      console.error('Error parsing changes:', error);
      return [];
    }
  }

  getBestConversionRate(variants: any[]): string {
    if (!variants || variants.length === 0) return '0.00';
    
    const bestRate = Math.max(...variants.map(variant => 
      this.calculateConversionRate(variant.conversions, variant.visits)
    ));
    
    return bestRate.toFixed(2);
  }

  getTotalImpressions(): number {
    return this.experimentData.defaultVisits + this.experimentData.variants.reduce((total, variant) => total + variant.visits, 0);
  }

  getTotalConversions(): number {
    return  this.experimentData.defaultConversions + this.experimentData.variants.reduce((total, variant) => total + variant.conversions, 0);
  }
}


