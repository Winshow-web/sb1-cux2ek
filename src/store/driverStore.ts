import { create } from 'zustand';
import type { Driver } from '@global/types.ts';

interface DriverState {
  pendingDrivers: Driver[];
  approvedDrivers: Driver[];
  addPendingDriver: (driver: Driver) => void;
  approveDriver: (driverId: string) => void;
  rejectDriver: (driverId: string) => void;
}

export const useDriverStore = create<DriverState>((set) => ({
  pendingDrivers: [],
  approvedDrivers: [],
  
  addPendingDriver: (driver) =>
    set((state) => ({
      pendingDrivers: [...state.pendingDrivers, { ...driver, status: 'pending' }],
    })),
    
  approveDriver: (driverId) =>
    set((state) => {
      const driver = state.pendingDrivers.find((d) => d.id === driverId);
      if (!driver) return state;

      return {
        pendingDrivers: state.pendingDrivers.filter((d) => d.id !== driverId),
        approvedDrivers: [...state.approvedDrivers, { ...driver, status: 'active' }],
      };
    }),
    
  rejectDriver: (driverId) =>
    set((state) => ({
      pendingDrivers: state.pendingDrivers.filter((d) => d.id !== driverId),
    })),
}));