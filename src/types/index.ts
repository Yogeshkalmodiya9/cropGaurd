export type Severity = 'Low' | 'Medium' | 'High';
export type RiskLevel = 'Low' | 'Moderate' | 'Critical';

export interface AttentionPoint {
  x: number;
  y: number;
  radius: number;
  intensity: number;
}

export interface ImageQualityCheck {
  passed: boolean;
  blurScore?: number;
  brightnessScore?: number;
  leafCoverageScore?: number;
  issues: string[];
  message: string;
  tips: string[];
}

export interface VerifiedTreatment {
  crop: string;
  disease: string;
  commonFarmerName: string;
  technicalDiseaseName: string;
  activeIngredient: string;
  formulation: string;
  recommendedDose: string;
  waterVolume: string;
  applicationMethod: string;
  cropStage: string;
  frequency: string;
  preHarvestInterval: string;
  safetyInstructions: string[];
  organicAlternatives: {
    title: string;
    description: string;
    howToApply: string;
  }[];
  immediateActions: string[];
  preventionMeasures: string[];
  source: string;
  sourceUrl: string;
  lastVerifiedDate: string;
}

export interface ChemicalCategory {
  category: string;
  examples: string;
  instructions: string;
}

export interface ScanResult {
  id: string;
  date: string;
  timestamp: string; // e.g. "08 Oct 2026, 04:30 PM"
  crop: string;
  cropIcon: string;
  disease: string;
  technicalDiseaseName?: string;
  farmerConditionName?: string; // Simple farmer friendly condition name
  status: 'Healthy' | 'Diseased' | 'Unknown';
  confidence: number;
  isLowConfidence?: boolean;
  lowConfidenceMessage?: string;
  severity: Severity;
  severityExplanation?: string; // "Patte ka noticeable hissa affected dikh raha hai"
  affectedArea: number; // percentage, e.g. 18
  riskLevel: RiskLevel;
  imageUrl: string;
  heatmapUrl?: string;
  
  // Image Quality Check
  imageQuality?: ImageQualityCheck;

  // Hinglish Farmer-friendly sections
  kyaHoRahaHai?: string;
  patteMeinKyaDikhRahaHai?: string;
  abhiKyaKarein?: string[];
  kaiseFailneSeRokein?: string[];
  
  // Verified Treatment Database Match
  verifiedTreatment?: VerifiedTreatment;

  // Standard Treatment plan
  symptomExplanation: string;
  immediateActions: string[];
  organicOptions: string[];
  chemicalCategory: ChemicalCategory;
  preventionTips: string[];
  expertHelpTips: string[];
  attentionPoints?: AttentionPoint[];
  fieldPlot?: string;
  source?: string;
  sourceUrl?: string;
  lastVerifiedDate?: string;

  // Crop validation fields
  isValidCrop?: boolean;
  validationStatus?: 'valid' | 'unclear' | 'unsupported';
  validationMessage?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'farmer' | 'ai';
  text: string;
  timestamp: string;
  actions?: string[];
}

export interface FarmPlot {
  id: string;
  name: string;
  crop: string;
  areaAcres: number;
  status: 'Healthy' | 'Monitor' | 'At Risk' | 'Critical';
  affectedPercentage: number;
  lastScanDate: string;
  soilMoisture: number; // %
  canopyTemp: number; // °C
  coordinates: { row: number; col: number };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'danger' | 'warning' | 'success' | 'info';
  timestamp: string;
  read: boolean;
  scanId?: string;
}

export interface FarmerProfile {
  name: string;
  farmName: string;
  location: string;
  totalAcres: number;
  primaryCrops: string[];
  phone: string;
  email: string;
}
