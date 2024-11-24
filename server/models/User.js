import bcrypt from 'bcryptjs';
import { supabase } from '../db/index.js';

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

export default User;