export type ComponentType =
  | "navbar"
  | "footer"
  | "heading"
  | "text"
  | "image"
  | "button"
  | "video"
  | "hero"
  | "testimonial"
  | "faq"
  | "courseCard";

export interface ComponentNode {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
}

export interface ResponsiveLayout {
  desktop: string; // '1-col', '2-col', '3-col', '4-col', '70-30', '30-70', '25-75'
  tablet: string;
  mobile: string;
}

export interface SectionNode {
  id: string;
  layout: ResponsiveLayout;
  children: ComponentNode[];
  style?: Record<string, any>;
  globalBlockId?: string; // If linked to a reusable master component block
}

export interface GlobalBlock {
  id: string;
  name: string;
  section: SectionNode;
  createdAt?: string;
}

export interface PageData {
  _id?: string;
  name: string;
  slug: string;
  sections: SectionNode[];
  showHeader?: boolean;
  showFooter?: boolean;
}
