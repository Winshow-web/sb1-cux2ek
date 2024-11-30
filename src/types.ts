
enum AccountType {
  none = 'none',

  client_disabled = 'client_disabled',
  client_suspended = 'client_suspended',

  client_new = 'client_new',

  client_pending = 'client_pending',
  client_rejected = 'client_rejected',

  client = 'client',


  driver_disabled = 'driver_disabled',
  driver_suspended = 'driver_suspended',

  driver_new = 'driver_new',

  driver_pending = 'driver_pending',
  driver_rejected = 'driver_rejected',

  driver = 'driver',


  administrator_disabled = 'administrator_disabled',
  administrator_suspended = 'administrator_suspended',
  administrator = 'administrator'
}

export { AccountType };

export interface BasicUser {
  uuid: string,
  name: string,
  email: string,
  password: string,
  accountType: AccountType,
}

// You can use union type
//  User = BasicUser | Client;
export interface Client extends BasicUser {
  phone: string,
}

export interface Driver {
  id: string;
  phone: string;
  experience: number;
  rating: number;
  licenseType: string;
  specializations: string[];
  serviceArea: string;
  availability: boolean;
  photo: string;
}

export interface Administrator extends BasicUser {}

export interface OtherInformation {
  bookings: Booking[];
  messages: Message[];
}

export enum BookingStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Completed = 'completed',
  Cancelled = 'cancelled'
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


export interface Message {
  message_id: string; // message id
  sender_uuid: string; // senders uuid
  receiver_uuid: string; // receivers uuid
  text_content: string; // text content
  media_url: string, // Url to the file in supabase
  reply_message_id: string; // message id to which this message is replying to
  read: boolean; // is message read by the receiver
  createdAt: Date;
}


// Frontend only types
