// Types pour la gestion des détails côté claims

export interface DriverDetails {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  licenseNumber: string;
  licenseIssuedDate: string;
  address: string;
  phone: string;
  email: string;
}

export interface CarDetails {
  id: string;
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
  vin: string;
  color: string;
}

export interface InsuranceDetails {
  id: string;
  company: string;
  policyNumber: string;
  startDate: string;
  endDate: string;
  coverageType: string;
}

export interface ClaimDetails {
  id: string;
  driver: DriverDetails;
  car: CarDetails;
  insurance: InsuranceDetails;
  dateOfAccident: string;
  location: string;
  description: string;
  audioUrl?: string; // Lien vers le fichier vocal
  imageUrl?: string; // Lien vers l'image de l'accident
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
  };
  status: 'pending' | 'approved' | 'rejected';
}
