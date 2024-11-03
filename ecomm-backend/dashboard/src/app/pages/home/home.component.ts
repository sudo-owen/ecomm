import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Experiment } from '../../models/experiment.interface';

interface OverallMetrics {
  totalExperiments: number;
  activeExperiments: number;
  totalConversions: number;
  overallConversionRate: number;
}

interface ExperimentWithProgress extends Experiment {
  progress: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  activeExperiments: ExperimentWithProgress[] = [];
  allExperiments: ExperimentWithProgress[] = [];
  overallMetrics: OverallMetrics = {
    totalExperiments: 0,
    activeExperiments: 0,
    totalConversions: 0,
    overallConversionRate: 0
  };

  ngOnInit() {
    fetch('http://localhost:3000/api/ab-tests').then((response) => {
      response.json().then((data) => {
        try {
          data.forEach((experiment: any) => {
            experiment.product = JSON.parse(experiment.productBlob);
            const totalVisits = experiment.variants.reduce((sum: number, variant: any) => sum + variant.visits, 0);
            const totalConversions = experiment.variants.reduce((sum: number, variant: any) => sum + variant.conversions, 0);
            experiment.progress = Math.min(Math.floor((totalVisits / 175) * 100), 300);
            experiment.impressions = totalVisits;
            experiment.conversions = totalConversions;
          });
        } catch (error) {
          console.log(error);
        }
        console.log(data);
        this.allExperiments = data;
        this.activeExperiments = data.filter((experiment: any) => experiment.status === 'ongoing')
          .sort((a: any, b: any) => a.product.id - b.product.id);

        this.overallMetrics = {
          totalExperiments: this.allExperiments.length,
          activeExperiments: this.activeExperiments.length,
          totalConversions: this.calculateTotalConversions(),
          overallConversionRate: this.calculateOverallConversionRate()
        };
      });
    });
  }

  private calculateOverallConversionRate(): number {
    let totalConversions = 0;
    let totalImpressions = 0;
  
    this.activeExperiments.forEach((experiment: ExperimentWithProgress) => {
      experiment.variants.forEach((variant: any) => {
        totalConversions += variant.conversions;
        totalImpressions += variant.visits;
      });
    });
  
    return totalImpressions > 0 ? (totalConversions / totalImpressions) * 100 : 0;
  }
  
  private calculateTotalConversions(): number {
    return this.activeExperiments.reduce((total: number, experiment: ExperimentWithProgress) => {
      return total + experiment.variants.reduce((expTotal: number, variant: any) => expTotal + variant.conversions, 0);
    }, 0);
  }
  
  getConversionRate(conversions: number, impressions: number): string {
    return ((conversions / impressions) * 100).toFixed(2);
  }
  getTotalConversions(experiment: ExperimentWithProgress): number {
    return experiment.variants.reduce((total, variant) => total + variant.conversions, 0);
  }

  getTotalImpressions(experiment: ExperimentWithProgress): number {
    return experiment.variants.reduce((total, variant) => total + variant.visits, 0);
  }

  getAverageConversionRate(experiment: ExperimentWithProgress): number {
    const totalConversions = this.getTotalConversions(experiment);
    const totalImpressions = this.getTotalImpressions(experiment);
    return totalImpressions > 0 ? (totalConversions / totalImpressions) * 100 : 0;
  }

  getBestConversionRate(experiment: ExperimentWithProgress): number {
    return Math.max(...experiment.variants.map(variant => 
      variant.visits > 0 ? (variant.conversions / variant.visits) * 100 : 0
    ));
  }

  getDefaultConversionRate(experiment: ExperimentWithProgress): number {
    if (experiment.impressions > 0 ) {
      return (experiment.conversions / experiment.impressions) * 100;
    }
    return 0;
  }
}
