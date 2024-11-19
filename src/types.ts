// ... existing types ...

export interface Message {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  createdAt: string;
  read: boolean;
}
/*
export enum Type {
  Client = 'Client',
  Driver = 'Driver'
}

export interface UserType {
  type: string;
}

export string UserType {};*/