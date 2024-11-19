// ... existing types ...
export enum UserType {
  Client = 'client',
  Driver = 'driver'
}

export enum BookingStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Completed = 'completed',
  Cancelled = 'cancelled'
}

export interface User {
  id: string;
  email: string;
  name: string;
  type: UserType;
}

export interface Driver {
  id: string;
  name: string;
  experience: number;
  rating: number;
  licenseType: string;
  availability: boolean;
  photo: string;
  specializations: string[];
  phone: string;
  serviceArea: string;
}

export interface Booking {
  id: string;
  driverId: string;
  clientId: string;
  startDate: Date;
  endDate: Date;
  route: string;
  requirements?: string;
  status: BookingStatus;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}

export interface BookingFormData {
  startDate: Date;
  endDate: Date;
  route: string;
  requirements: string;
}