export enum AccountType {
  basic_disabled = 'basic_disabled', // disabled account
  basic_suspended = 'basic_suspended', // suspended account
  basic = 'basic', // approved/active basic

  client_disabled = 'client_disabled', // disabled account
  client_suspended = 'client_suspended', // suspended account
  client_pending = 'client_pending', // approval request pending
  client_rejected = 'client_rejected', // approval request rejected
  client = 'client', // approved/active client

  driver_disabled = 'driver_disabled', // disabled account
  driver_suspended = 'driver_suspended', // suspended account
  driver_pending = 'driver_pending', // approval request pending
  driver_rejected = 'driver_rejected', // approval request rejected
  driver = 'driver', // approved/active driver

  administrator_disabled = 'administrator_disabled', // disabled account
  administrator_suspended = 'administrator_suspended', // suspended account
  administrator = 'administrator', // approved/active administrator
}

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

export interface Driver extends BasicUser {
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