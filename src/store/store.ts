import { create } from 'zustand';
import { BasicUser, Driver, Booking, Message, AccountType, BookingStatus } from './index';

interface AppState {
  user: BasicUser | null;
  drivers: Driver[];
  bookings: Booking[];
  messages: Message[];
  setUser: (user: BasicUser | null) => void;
  setDrivers: (drivers: Driver[]) => void;
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  addMessage: (message: Message) => void;
  updateDriverAvailability: (driverUuid: string, availability: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  drivers: [],
  bookings: [],
  messages: [],
  
  setUser: (user) => set({ user }),
  
  setDrivers: (drivers) => set({ drivers }),
  
  addBooking: (booking) => set((state) => ({
    bookings: [...state.bookings, booking],
  })),
  
  updateBookingStatus: (bookingId, status) => set((state) => ({
    bookings: state.bookings.map((booking) =>
      booking.booing_id === bookingId ? { ...booking, status } : booking
    ),
  })),
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
  })),
  
  updateDriverAvailability: (driverUuid, availability) => set((state) => ({
    drivers: state.drivers.map((driver) =>
      driver.uuid === driverUuid ? { ...driver, availability } : driver
    ),
  })),
}));