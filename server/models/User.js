import bcrypt from 'bcryptjs';
import { supabase } from '../db/index.js';

const User = {
  async create({ name, email, password, type }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const { data, error } = await supabase
      .from('users')
      .insert([
        { name, email, password: hashedPassword, type }
      ])
      .select('id, name, email, type')
      .single();

    if (error) throw error;
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