interface Variant {
  name: string;
  impressions: number;
  conversions: number;
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