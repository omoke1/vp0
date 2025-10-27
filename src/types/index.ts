// Navigation types
export interface NavigationItem {
  href: string;
  label: string;
  delay?: number;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Card component types
export interface CardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export interface ProblemCardProps extends CardProps {
  iconName: string;
  iconColor?: string;
}

export interface SolutionCardProps extends CardProps {
  isTall?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
}

// Section types
export interface SectionProps {
  className?: string;
  children: React.ReactNode;
}

export interface SectionHeaderProps {
  badge: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

// Animation types
export interface AnimationProps {
  delay?: number;
  duration?: number;
  children: React.ReactNode;
}

// Workflow step types
export interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

// Integration types
export interface IntegrationStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  position: 'left' | 'center' | 'right';
}

// Use case types
export interface UseCase {
  id: number;
  title: string;
  description: string;
  icon: string;
  examples: string[];
}

// Footer types
export interface FooterLink {
  href: string;
  label: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

// Theme types
export type Theme = 'light' | 'dark';

// Responsive breakpoints
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Animation variants for Framer Motion
export interface AnimationVariants {
  hidden: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
  };
  visible: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
    transition?: {
      duration?: number;
      delay?: number;
      ease?: string;
    };
  };
}
