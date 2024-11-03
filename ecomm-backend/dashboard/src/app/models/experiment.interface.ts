interface Variant {
  changes: string;
  visits: number;
  conversions: number;
}

export interface ExperimentWithProduct extends Experiment {
  product: any;
}

export interface Experiment {
  id: number;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  description: string;
  conversions: number;
  impressions: number;
  variants: Variant[];
}