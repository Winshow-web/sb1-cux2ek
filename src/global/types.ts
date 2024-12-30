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

export class User {
    id: string;
    name: string;
    email: string;
    account_type: AccountType;

    constructor(uuid: string, name: string, email: string, accountType: AccountType) {
        this.id = uuid;
        this.name = name;
        this.email = email;
        this.account_type = accountType;
    }
}

export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    photo: string;
}

export interface ClientFormSubmit {
    id: string;
    name: string;
    email: string;
    phone: string;
    photo: File;
}

export interface ClientForm {
    id: string;
    name: string;
    email: string;
    phone: string;
    photo: string
}

export interface Driver {
    id: string;
    name: string;
    email: string;
    phone: string;
    experience: string;
    rating: number;
    license_type: string;
    specializations: string[];
    serviceArea: string;
    availability: boolean;
    photo: string;
}

export interface DriverFormSubmit {
    id: string;
    name: string;
    email: string;
    phone: string;
    experience: string;
    licenseType: string;
    specializations: string[];
    serviceArea: string;
    photo: File;
}

export interface DriverForm {
    id: string;
    name: string;
    email: string;
    phone: string;
    experience: string;
    licenseType: string;
    specializations: string[];
    serviceArea: string;
    photo: string;
}

export enum AdminTab {
    driver_form_pending = 'driver_form_pending',
    drivers = 'drivers',
    client_form_pending = 'client_form_pending',
    clients = 'clients'
}

export enum DriverTab {
    info = 'info',
    booking = 'booking',
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
    id: string;
    sender: string;
    receiver: string;
    content: string;
    createdAt: string;
    read: boolean;
}

export interface AdminStats {
    totalUsers: number;
    activeUsers: number;
    pendingApprovals: number;
    totalBookings: number;
    activeDrivers: number;
}

export interface Invoice {
    id: string;
    client: {
        name: string;
        email: string;
    };
    amount: number;
    date: string;
    status: 'paid' | 'pending' | 'cancelled';
    items: InvoiceItem[];
}

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}