export interface Driver extends User {
  phone: string;
  experience: number;
  rating: number;
  licenseType: string;
  specializations: string[];
  serviceArea: string;
  availability: boolean;
  photo: string;
}

export interface User {
  uuid: string;
  name: string;
  email: string;
  password: string;
  accountType: AccountType;
}

export enum AccountType {
  basic = 'basic',
  client = 'client',
  driver = 'driver',
  admin = 'admin',
}

export interface Booking {
  booing_id: string;
  driver_uuid: string;
  client_uuid: string;
  startDate: Date;
  endDate: Date;
  route: string;
  requirements?: string;
  status: BookingStatus;
}

export enum BookingStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Completed = 'completed',
  Cancelled = 'cancelled'
}

export interface Message {
  message_id: string;
  sender_uuid: string;
  receiver_uuid: string;
  text_content: string;
  media_url: string;
  reply_message_id: string;
  read: boolean;
  createdAt: Date;
}