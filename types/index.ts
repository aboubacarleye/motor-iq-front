export interface Driver {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  license_plate: string;
}

export interface Claim {
  id: number;
  description: string;
  status: string;
  date_created: string;
  fraud_risk_score: number;
  ai_analysis?: string;
}

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Dashboard: undefined;
  ReportAccident: undefined;
  ClaimsTracking: undefined;
  Profile: undefined;
  AssistantChat: undefined;
};