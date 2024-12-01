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
    uuid: string;
    name: string;
    email: string;
    account_type: AccountType;

    constructor(uuid: string, name: string, email: string, accountType: AccountType) {
        this.uuid = uuid;
        this.name = name;
        this.email = email;
        this.account_type = accountType;
    }
}

export interface Client {
    id: string;
    phone: string;
}

export interface ClientForm {
    id: string;
    phone: string;
    photo: File;
}

export interface Driver {
    id: string;
    phone: string;
    experience: string;
    rating: number;
    licenseType: string;
    specializations: string[];
    serviceArea: string;
    availability: boolean;
    photo: string;
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
    photo: File;
}