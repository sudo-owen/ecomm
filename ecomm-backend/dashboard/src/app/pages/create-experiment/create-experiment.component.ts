import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Experiment } from '../../models/experiment.interface';

interface ExperimentParams {
  duration: string;
  targetAudience: string;
  trafficAllocation: string;
}


@Component({
  selector: 'app-create-experiment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-experiment.component.html',
  styleUrls: ['./create-experiment.component.css']
})
export class CreateExperimentComponent {
  generatedExperiment: Experiment | null = null;
  isLoading = false;
  experimentParams: ExperimentParams = {
    duration: '7',
    targetAudience: 'all',
    trafficAllocation: '50',
  };

  async handleSubmit() {
    this.isLoading = true;
    try {
      this.generatedExperiment = await this.generateExperiment(1, 'description');
    } catch (error) {
      console.error("Failed to generate experiment:", error);
    } finally {
      this.isLoading = false;
    }
  }

  async generateExperiment(productId: number, changeType: string): Promise<Experiment> {
    const response = await fetch('http://localhost:3000/api/create-ab-test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: productId,
        name: `Experiment for Product ${productId}`,
        description: `A/B test for ${changeType} of product ${productId}`,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}