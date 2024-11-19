import { supabase } from '../db/index.js';

const Driver = {
  async create({ userId, experience, licenseType, photo, specializations, phone, serviceArea }) {
    const { data, error } = await supabase
      .from('drivers')
      .insert([{
        user_id: userId,
        experience,
        license_type: licenseType,
        photo,
        specializations,
        phone,
        service_area: serviceArea
      }])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  async findByUserId(userId) {
    const { data, error } = await supabase
      .from('drivers')
      .select(`
        *,
        users (
          name,
          email
        )
      `)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async findAll() {
    const { data, error } = await supabase
      .from('drivers')
      .select(`
        *,
        users (
          name,
          email
        )
      `);

    if (error) throw error;
    return data;
  },

  async updateAvailability(userId, availability) {
    const { data, error } = await supabase
      .from('drivers')
      .update({ availability })
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  async update(userId, updates) {
    const { data, error } = await supabase
      .from('drivers')
      .update(updates)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }
};

export default Driver;