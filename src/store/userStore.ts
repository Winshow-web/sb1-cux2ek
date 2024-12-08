import { create } from 'zustand';
import type { User, Driver } from '../types';

interface UserState {
  user: User | null;
  drivers: Driver[];
  setUser: (user: User | null) => void;
  setDrivers: (drivers: Driver[]) => void;
  updateDriver: (driverId: string, updates: Partial<Driver>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  drivers: [],
  setUser: (user) => set({ user }),
  setDrivers: (drivers) => set({ drivers }),
  updateDriver: (driverId, updates) =>
    set((state) => ({
      drivers: state.drivers.map((driver) =>
        driver.id === driverId ? { ...driver, ...updates } : driver
      ),
    })),
}));