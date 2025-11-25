
export type UnitSystem = 'imperial' | 'metric';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type WoodType = 'Pine/Construction Lumber' | 'Oak/Hardwood' | 'Plywood/MDF' | 'Reclaimed Wood';

export interface CutItem {
  partName: string;
  quantity: number;
  thickness: string;
  width: string;
  length: string;
  material: string;
  notes?: string;
}

export interface AssemblyStep {
  stepNumber: number;
  instruction: string;
}

export interface WoodworkingPlan {
  title: string;
  description: string;
  estimatedCost: string;
  estimatedTime: string;
  estimatedRetailPrice: string; // Used to show savings
  overallDimensions: {
    height: string;
    width: string;
    depth: string;
  };
  shoppingList: string[];
  cutList: CutItem[];
  assemblySteps: AssemblyStep[];
}
