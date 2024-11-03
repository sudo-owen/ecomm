import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArrowRight, Crosshair, LucideAngularModule, Target, Trash2 } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { ProductListComponent } from '../../components/product-list/product-list.component/product-list.component';
import { Experiment } from '../../models/experiment.interface';
import {
  ExperimentParams,
  SelectedElement,
} from '../../models/selected-element.interface';
import { IframeCommunicationService } from '../../services/iframe-communication.service';
import { Product } from '../../services/api.service';

interface Tab {
  id: string;
  label: string;
}

@Component({
  selector: 'app-create-experiment',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ProductListComponent],
  templateUrl: './create-experiment.component.html',
  styleUrls: ['./create-experiment.component.css']
})
export class CreateExperimentComponent implements OnInit, OnDestroy {
  generatedExperiment: Experiment | null = null;
  isLoading = false;
  iframeUrl;
  isSelectionMode = false;
  iframeLoaded = false;
  icons = { Target, Trash2, Crosshair, ArrowRight};
  private subscription = new Subscription();

  @ViewChild(ProductListComponent) productListComponent!: ProductListComponent;

  tabs: Tab[] = [
    { id: 'preview', label: 'Website Preview' },
    { id: 'products', label: 'Products' }
  ];
  
  activeTab: string = 'preview';

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

      // Check if it's a product element and toggle it in the ProductListComponent
      if (element.selector.startsWith('data-product-')) {
        const productId = element.selector.replace('data-product-', '');
        const product = this.productListComponent.productsSubject.value.find(p => p.id.toString() === productId);
        if (product) {
          this.productListComponent.toggleProduct(product);
        }
      }
    }
  }

  clearSelectedElements() {
    this.experimentParams.selectedElements = [];
  }

  async handleSubmit() {
    this.isLoading = true;
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  parseProducts(p: Product[]) {
    // Remove all existing products from the experiment, then add in these
    // A product element is one which starts with the data tag <product>
    this.experimentParams.selectedElements = this.experimentParams.selectedElements.filter(
      (e) => !e.selector.startsWith('data-product-'),
    );
    p.forEach((product) => {
      this.experimentParams.selectedElements.push({
        selector: `data-product-${product.id}`,
        originalContent: product.name,
        location: 'Product',
      });
    });
  }
}
