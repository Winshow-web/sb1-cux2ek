import bcrypt from 'bcryptjs';
import { supabase } from '../db/index.js';
import AccountType from './AccountType.js';

class Basic {
  constructor(id, name, email, password, accountType) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.accountType = AccountType.basic;
  }

  async createAccount(name, email, password, accountType) {
    try {
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert into the Supabase database
      const { data, error } = await supabase
          .from('Basic')
          .insert([
            {
              name: name,
              email: email,
              password: hashedPassword,
              account_type: accountType,
            }
          ])
          .single();

      if (error) {
        console.error('Supabase error:', error.message);
        return { success: false, message: error.message };
      }

      // If successful, return the data
      return { success: true, data };
    } catch (error) {
      // Catch any unexpected errors and log them
      console.error('Error creating Basic user:', error);
      return { success: false, message: 'Basic user creation failed', error: error.message };
    }
  }
}



class Driver extends Basic {
  constructor(
      id, name, email, password, accountType,
      phone, experience, rating, licenseType,
      specializations, serviceArea, availability, photo
  ) {
    super(id, name, email, password);
    this.accountType = AccountType.driver_pending;
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

class Client extends Basic {
  constructor(id, name, email, password, accountType, phone) {
    super(id, name, email, password);
    this.accountType = AccountType.client;
    this.phone = phone;
  }
}

export { Basic, Driver, Client };


/*
const User = {
  async create({ name, email, password, type }) {
    //const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Create method called with:');
    
    const { data, error } = await supabase
      .from('users')
      .insert([
        { name, email, password: password, type }
      ])
      .select('id, name, email, type')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    console.log('User: ', name, email, password, type, ' created');

    return data;
  },

  async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, type')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
};
*/

export default User;