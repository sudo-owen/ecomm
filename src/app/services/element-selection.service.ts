import { Injectable } from '@angular/core';

export interface SelectionPayload {
  selector: string;
  originalContent: string;
  location: string;
  productId?: string;
  type?: 'product';
}

@Injectable({
  providedIn: 'root',
})
export class ElementSelectionService {
  private hoveredElement: HTMLElement | null = null;
  private isSelectionMode = false;

  private findSelectableParent(element: HTMLElement): HTMLElement | null {
    let currentElement: HTMLElement | null = element;

    while (currentElement && !currentElement.hasAttribute('data-selectable')) {
      currentElement = currentElement.parentElement;
    }

    return currentElement;
  }

  private addHighlight(element: HTMLElement) {
    element.style.backgroundColor = 'rgba(37, 99, 235, 0.1)';
    element.style.outline = '2px solid #2563eb';
    element.style.outlineOffset = '2px';
    element.style.cursor = 'pointer';
  }

  private removeHighlight(element: HTMLElement) {
    element.style.backgroundColor = '';
    element.style.outline = '';
    element.style.outlineOffset = '';
    element.style.cursor = '';
  }

  private handleMouseOver = (event: MouseEvent) => {
    if (!this.isSelectionMode) return;

    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLElement;
    const selectableElement = this.findSelectableParent(target);

    if (!selectableElement) return;

    if (this.hoveredElement) {
      this.removeHighlight(this.hoveredElement);
    }
    this.hoveredElement = selectableElement;
    this.addHighlight(selectableElement);
  };

  private handleMouseOut = (event: MouseEvent) => {
    if (!this.isSelectionMode) return;

    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLElement;
    const selectableElement = this.findSelectableParent(target);

    if (!selectableElement) return;

    if (this.hoveredElement === selectableElement) {
      this.removeHighlight(this.hoveredElement);
      this.hoveredElement = null;
    }
  };

  private handleClick = (event: MouseEvent) => {
    if (!this.isSelectionMode) return;

    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLElement;
    const selectableElement = this.findSelectableParent(target);

    if (!selectableElement) return;

    const componentType = selectableElement.getAttribute('data-component-type');
    const productId = selectableElement.getAttribute('data-product-id');

    if (componentType) {
      let payload: SelectionPayload = {
        selector: `[data-component-type="${componentType}"]`,
        originalContent: selectableElement.innerText || '',
        location: this.getLocationFromComponentType(componentType),
      };

      if (productId) {
        payload = {
          ...payload,
          productId,
          type: 'product',
        };
      }

      window.parent.postMessage(
        {
          type: 'ELEMENT_SELECTED',
          payload,
        },
        '*',
      );
    }
  };

  private getLocationFromComponentType(componentType: string): string {
    const locationMap: Record<string, string> = {
      heroSection: 'Home - Hero Section',
      featuresSection: 'Home - Features Section',
      productsSection: 'Home - Products Section',
      testimonialsSection: 'Home - Testimonials Section',
    };

    if (componentType.startsWith('product-')) {
      return 'Products - Individual Product';
    }

    return locationMap[componentType] || 'Home';
  }

  toggleSelectionMode(enabled: boolean) {
    this.isSelectionMode = enabled;
    console.log('Selection mode:', enabled);

    if (enabled) {
      document.addEventListener('mouseover', this.handleMouseOver, true);
      document.addEventListener('mouseout', this.handleMouseOut, true);
      document.addEventListener('click', this.handleClick, true);
    } else {
      document.removeEventListener('mouseover', this.handleMouseOver, true);
      document.removeEventListener('mouseout', this.handleMouseOut, true);
      document.removeEventListener('click', this.handleClick, true);

      if (this.hoveredElement) {
        this.removeHighlight(this.hoveredElement);
        this.hoveredElement = null;
      }
    }
  }
}
