import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Target, Trash2 } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { IframeCommunicationService } from '../../services/iframe-communication.service';
import {
  ExperimentParams,
  SelectedElement,
} from '../../models/selected-element.interface';
import { Experiment } from '../../models/experiment.interface';

@Component({
  selector: 'app-create-experiment',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './create-experiment.component.html',
  styleUrls: ['./create-experiment.component.css'],
})
export class CreateExperimentComponent implements OnInit, OnDestroy {
  generatedExperiment: Experiment | null = null;
  isLoading = false;
  iframeUrl;
  isSelectionMode = false;
  iframeLoaded = false;
  icons = { Target, Trash2 };
  private subscription = new Subscription();

  experimentParams: ExperimentParams = {
    duration: '7',
    targetAudience: 'all',
    trafficAllocation: '50',
    selectedElements: [],
  };

  constructor(private iframeService: IframeCommunicationService) {
    this.iframeUrl = this.iframeService.getIframeUrl();
  }

  ngOnInit() {
    this.experimentParams.selectedElements = [];

    // Listen for messages from iframe
    window.addEventListener('message', this.handleIframeMessage.bind(this));

    this.subscription.add(
      this.iframeService.elementSelected$.subscribe((element) => {
        const isDuplicate = this.experimentParams.selectedElements.some(
          (e) => e.selector === element.selector,
        );
        if (!isDuplicate) {
          this.experimentParams.selectedElements.push(element);
        }
      }),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    window.removeEventListener('message', this.handleIframeMessage.bind(this));
  }

  private handleIframeMessage(event: MessageEvent) {
    this.iframeService.handleIframeMessage(event);
  }

  onIframeLoad() {
    this.iframeLoaded = true;
  }

  toggleSelectionMode() {
    this.isSelectionMode = !this.isSelectionMode;
    this.iframeService.sendMessageToIframe({
      type: 'TOGGLE_SELECTION_MODE',
      payload: this.isSelectionMode,
    });
  }

  removeSelectedElement(element: SelectedElement) {
    const index = this.experimentParams.selectedElements.findIndex(
      (e) => e.selector === element.selector,
    );
    if (index !== -1) {
      this.experimentParams.selectedElements.splice(index, 1);
    }
  }

  clearSelectedElements() {
    this.experimentParams.selectedElements = [];
  }

  async handleSubmit() {
    this.isLoading = true;
    try {
      this.generatedExperiment = await this.generateExperiment(
        1,
        'description',
      );
    } catch (error) {
      console.error('Failed to generate experiment:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private async generateExperiment(
    productId: number,
    changeType: string,
  ): Promise<Experiment> {
    const response = await fetch('http://localhost:3000/api/create-ab-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId,
        name: `Experiment for Product ${productId}`,
        description: `A/B test for ${changeType} of product ${productId}`,
      }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }
}
