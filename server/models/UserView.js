import AccountType from './AccountType';

class BasicView {
    constructor(id, name, email, accountType) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.accountType = accountType;
    }
}

class DriverView extends BasicView {
    constructor(
        id, name, email, accountType,
        phone, experience, rating, licenseType, specializations, serviceArea, availability, photo
    ) {
        super(id, name, email, accountType);
        this.phone = phone;
        this.experience = experience;
        this.rating = rating;
        this.licenseType = licenseType;
        this.specializations = specializations;
        this.serviceArea = serviceArea;
        this.availability = availability;
        this.photo = photo;
    }
}

class ClientView extends BasicView {
    constructor(id, name, email, accountType, phone) {
        super(id, name, email, accountType);
        this.phone = phone;
    }
}

export { BasicView, DriverView, ClientView };
