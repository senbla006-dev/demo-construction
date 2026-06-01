export interface Project {
  id: string;
  title: string;
  city: string;
  year: string;
  category: string;
  image: string;
  description: string;
  stats: { label: string; value: string }[];
}

export interface ServiceItem {
  id: string;
  title: string;
  iconName: string;
  description: string;
  features: string[];
  specs: string;
}

export interface MachineSpec {
  name: string;
  type: string;
  capacity: string;
  usage: string;
  powerRating: string;
  efficiency: string;
}

export interface ProcessPhase {
  number: string;
  title: string;
  duration: string;
  description: string;
  deliverable: string;
}

export interface EstimatePhase {
  phaseName: string;
  description: string;
  durationWeeks: number;
  percentageOfBudget: number;
}

export interface EstimateResult {
  projectName: string;
  suggestedScope: string;
  estimatedCostRange: string;
  engineeringRequirements: string[];
  materialsList: string[];
  estimatedDurationMonths: number;
  riskMitigationAlerts: string[];
  projectPhases: EstimatePhase[];
}

export interface EstimateInput {
  projectType: string;
  scale: string;
  city: string;
  budget: string;
  customDetails: string;
}

export interface AuditMetric {
  title: string;
  value: string;
  sub: string;
  iconName: string;
}
