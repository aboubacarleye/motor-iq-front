import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Claim, Vehicle } from '../types';

export type ClaimStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Inspection Required'
  | 'Approved'
  | 'Rejected'
  | 'Completed';

export interface PolicySummary {
  id: string;
  name: string;
  policyNumber: string;
  coverageLimit: string;
  renewalDate: string;
}

export interface DriverProfile {
  name: string;
  phone: string;
  vehicles: Vehicle[];
  policy: PolicySummary;
  avatarInitials?: string;
}

export interface ExtendedClaim extends Claim {
  claimId: string;
  vehicleName: string;
  status: ClaimStatus;
  submissionDate: string;
  images?: string[];
  timeline: { label: string; completed: boolean }[];
}

interface ClaimsState {
  profile: DriverProfile;
  claims: ExtendedClaim[];
  addClaim: (claim: Omit<ExtendedClaim, 'id' | 'claimId' | 'timeline'>) => ExtendedClaim;
  updateClaim: (id: number, patch: Partial<ExtendedClaim>) => void;
  updateProfile: (partial: Partial<DriverProfile>) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Vehicle;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

let nextId = 3;

const useClaimsStore = create<ClaimsState>()(
  persist(
    (set, get) => ({
  profile: {
    name: 'Amira Mensah',
    phone: '+233 555 123 456',
    vehicles: [
      {
        id: 1,
        make: 'Toyota',
        model: 'Corolla',
        year: 2021,
        license_plate: 'GC-1021-21',
      },
      {
        id: 2,
        make: 'Honda',
        model: 'Civic',
        year: 2019,
        license_plate: 'GE-8876-19',
      },
    ],
    policy: {
      id: 'POL-78921',
      name: 'Comprehensive Car Insurance',
      policyNumber: 'ABC-12345789',
      coverageLimit: '$50,000',
      renewalDate: 'Dec 12, 2026',
    },
    avatarInitials: 'AM',
  },
  claims: [
    {
      id: 1,
      description: 'Front bumper damage in parking lot',
      status: 'Under Review',
      date_created: '2026-03-14',
      fraud_risk_score: 12,
      claimId: 'CLM-1021',
      vehicleName: 'Toyota Corolla',
      submissionDate: '2026-03-14',
      images: [],
      timeline: [
        { label: 'Report Submitted', completed: true },
        { label: 'Investigation', completed: true },
        { label: 'Verification', completed: false },
        { label: 'Decision', completed: false },
        { label: 'Completed', completed: false },
      ],
    },
    {
      id: 2,
      description: 'Minor rear body scratch',
      status: 'Completed',
      date_created: '2026-02-01',
      fraud_risk_score: 5,
      claimId: 'CLM-0998',
      vehicleName: 'Honda Civic',
      submissionDate: '2026-02-01',
      images: [],
      timeline: [
        { label: 'Report Submitted', completed: true },
        { label: 'Investigation', completed: true },
        { label: 'Verification', completed: true },
        { label: 'Decision', completed: true },
        { label: 'Completed', completed: true },
      ],
    },
  ],
  addClaim: (newClaim) => {
    let createdClaim: ExtendedClaim | null = null;
    set((state) => {
      const id = nextId++;
      const claimId = `CLM-${1000 + id}`;
      const timeline = [
        { label: 'Report Submitted', completed: true },
        { label: 'Investigation', completed: false },
        { label: 'Verification', completed: false },
        { label: 'Decision', completed: false },
        { label: 'Completed', completed: false },
      ];

      createdClaim = {
        ...(newClaim as ExtendedClaim),
        id,
        claimId,
        timeline,
      };

      return {
        claims: [
          {
            ...createdClaim,
          },
          ...state.claims,
        ],
      };
    });
    return createdClaim as ExtendedClaim;
  },
  updateClaim: (id, patch) =>
    set((state) => ({
      claims: state.claims.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    })),
  updateProfile: (partial) =>
    set((state) => ({
      profile: {
        ...state.profile,
        ...partial,
      },
    })),
  addVehicle: (vehicleInput) =>
    set((state) => {
      const maxId =
        state.profile.vehicles.reduce((max, v) => Math.max(max, v.id), 0) || 0;
      const newVehicle: Vehicle = { ...vehicleInput, id: maxId + 1 };
      return {
        profile: {
          ...state.profile,
          vehicles: [...state.profile.vehicles, newVehicle],
        },
      };
    }),
  theme: 'light',
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),
    }),
    {
      name: 'motoriq-claims-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => state,
    },
  ),
);

export default useClaimsStore;

