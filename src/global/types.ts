enum AccountType {
    none = 'none',

    client_disabled = 'client_disabled',
    client_suspended = 'client_suspended',

    client_new = 'client_new',

    client_pending = 'client_pending', // -
    client_can_resubmit= 'client_can_resubmit', // -

    client = 'client',


    driver_disabled = 'driver_disabled',
    driver_suspended = 'driver_suspended',

    driver_new = 'driver_new',

    driver_pending = 'driver_pending', // -
    driver_can_resubmit = 'driver_can_resubmit', // -

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
    phone: string;
    account_type: AccountType;

    constructor(id: string, name: string, email: string, phone: string, accountType: AccountType) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone
        this.account_type = accountType;
    }
}

export class Client extends User {
    photo: string;

    constructor(
        id: string,
        name: string,
        email: string,
        accountType: AccountType,
        phone: string,
        photo: string
    ) {
        super(id, name, email, phone, accountType);
        this.photo = photo;
    }
}

export class Driver extends User {
    experience: string;
    rating: number;
    license_type: string;
    specializations: string[];
    serviceArea: string;
    availability: boolean;
    photo: string;

    constructor(
        id: string,
        name: string,
        email: string,
        phone: string,
        accountType: AccountType,
        experience: string,
        rating: number,
        license_type: string,
        specializations: string[],
        serviceArea: string,
        availability: boolean,
        photo: string
    ) {
        super(id, name, email, phone, accountType);
        this.experience = experience;
        this.rating = rating;
        this.license_type = license_type;
        this.specializations = specializations;
        this.serviceArea = serviceArea;
        this.availability = availability;
        this.photo = photo;
    }
}





export interface ClientFormSubmit {
    photo: File;
}

export interface DriverFormSubmit {
    experience: string;
    licenseType: string;
    specializations: string[];
    serviceArea: string;
    photo: File;
}





export interface ClientForm {
    id: string;
    name: string;
    email: string;
    phone: string;
    photo: string
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

export enum ClientTab {
    Overview = 'overview',
    Schedule = 'schedule',
    Bookings = 'bookings',
    Booking_Requests = 'booking_requests',
    Book = 'book',
    Invoices = 'invoices',
}

export enum DriverTab {
    Overview = 'overview',
    Bookings = 'bookings',
    Booking_Requests = 'booking_requests',
}




export enum BookingStatus {
    Pending = 'pending',
    Confirmed = 'confirmed',
    Active = 'active',
    Completed = 'completed',
    Cancelled = 'cancelled'
}

export interface Booking {
    booking_id: string;
    driver_id: string;
    client_id: string;
    start_date: Date;
    end_date: Date;
    route: string;
    requirements?: string;
    status: BookingStatus;
}

export interface BookingRequest {
    booking_id: string;
    driver_ids: string[];
    client_id: string;
    start_date: Date;
    end_date: Date;
    route: string;
    requirements?: string;
}