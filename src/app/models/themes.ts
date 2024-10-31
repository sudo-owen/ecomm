// Base export interface for common styles
export interface BaseStyles {
  padding?: string;
  margin?: string;
  background?: string;
  rounded?: string;
  shadow?: string;
}

// Hero Section Styles
export interface HeroSectionStyles extends BaseStyles {
  container: string;
  headingText: string;
  subText: string;
  ctaButton: string;
  imageContainer: string;
}

// Feature Card Styles
export interface FeatureCardStyles extends BaseStyles {
  container: string;
  icon: string;
  title: string;
  description: string;
  image: string;
}

// Testimonial Card Styles
export interface TestimonialCardStyles extends BaseStyles {
  container: string;
  starIcon: string;
  quote: string;
  authorContainer: string;
  authorName: string;
  authorTitle: string;
}

// Product Card Styles
export interface ProductCardStyles extends BaseStyles {
  container: string;
  title: string;
  description: string;
  price: string;
  ctaButton: string;
}

// Product Holder Styles
export interface ProductHolderStyles extends BaseStyles {
  container: string;
  numItems: number;
}

// Main Theme export Interface
export interface AppTheme {
  heroSection: HeroSectionStyles;
  featureCard: FeatureCardStyles;
  testimonialCard: TestimonialCardStyles;
  productCard: ProductCardStyles;
  productHolder: ProductHolderStyles;
}
