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

/*export interface Message {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Booking {
  id: any;
  driverId: any,
  clientId: any,
  status: any,
  startDate: any,
  endDate: any,
  route: any,
  requirements: any,
}

export interface Driver {
  Userid: any,
  name: any,
  availability: any,
  experience: any,
  licenseType: any,
  photo: any,
  specializations: any,
  phone: any,
  service_area: any
}

export enum UserType {
  Client = 'Client',
  Driver = 'Driver'
}

export interface User {
  id: any;
  name: any;
  type: any;
}
*/