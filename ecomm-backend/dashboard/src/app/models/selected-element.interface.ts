export interface SelectedElement {
  selector: string;
  originalContent: string;
  location: string;
}

export interface ExperimentParams {
  duration: string;
  targetAudience: string;
  trafficAllocation: string;
  selectedElements: SelectedElement[];
}
