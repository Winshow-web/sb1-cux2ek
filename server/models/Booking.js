import { supabase } from '../db/index.js';

export const Booking = {
  async create({ driverId, clientId, startDate, endDate, route, requirements }) {
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        driver_id: driverId,
        client_id: clientId,
        start_date: startDate,
        end_date: endDate,
        route,
        requirements
      }])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  async findByUserId(userId, userType) {
    const field = userType === 'driver' ? 'driver_id' : 'client_id';
    
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        drivers (
          photo
        ),
        users!bookings_driver_id_fkey (
          name,
          email
        ),
        users!bookings_client_id_fkey (
          name,
          email
        )
      `)
      .eq(field, userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }
};