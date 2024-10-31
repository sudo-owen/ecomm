import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ExperimentParams {
  duration: string;
  targetAudience: string;
  trafficAllocation: string;
}

interface GeneratedExperiment {
  name: string;
  description: string;
  variants: string[];
}

@Component({
  selector: 'app-create-experiment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-experiment.component.html',
  styleUrls: ['./create-experiment.component.css']
})
export class CreateExperimentComponent {
  prompt = '';
  generatedExperiment: GeneratedExperiment | null = null;
  isLoading = false;
  experimentParams: ExperimentParams = {
    duration: '7',
    targetAudience: 'all',
    trafficAllocation: '50',
  };

  async handleSubmit() {
    this.isLoading = true;
    try {
      this.generatedExperiment = await this.generateExperiment(this.prompt);
    } catch (error) {
      console.error("Failed to generate experiment:", error);
    } finally {
      this.isLoading = false;
    }
  }

  async generateExperiment(prompt: string): Promise<GeneratedExperiment> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      name: "Generated Experiment",
      description: `This is an automatically generated experiment based on the prompt: "${prompt}"`,
      variants: ["Control", "Variant A", "Variant B"],
    };
  }
}