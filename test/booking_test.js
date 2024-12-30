// Import the Supabase client
import { createClient } from '@supabase/supabase-js';

// Supabase project URL and key
const supabaseUrl = '';
const supabaseKey = '';
// Create a Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function insertBooking(driverId, clientId, startDate, endDate, route, requirements, status) {
    try {

        // Insert the new booking into the bookings table
        const { data, error } = await supabase
            .from('booking.bookings')
            .insert([
                {
                    driver_id: driverId,
                    client_id: clientId,
                    start_date: startDate,
                    end_date: endDate,
                    route: route,
                    requirements: requirements,
                    status: status,
                }
            ]);

        if (error) {
            console.error('Error inserting booking:', error);
        } else {
            console.log('Booking inserted successfully:', data);
        }
    } catch (err) {
        console.error('Error:', err);
    }
}


// Example driver and client IDs (replace with valid UUIDs from your database)
const driverId = 'b3c1ab25-95db-49ab-9570-9cb4c8e0e9b9';  // Replace with actual driver UUID
const clientId = 'f5d056e0-8a89-44ed-b3bb-209c1bb14fc7';  // Replace with actual client UUID

// Example booking details
const startDate = new Date().toISOString();
const endDate = new Date(new Date().getTime() + 3600 * 1000).toISOString();  // 1 hour later
const route = 'Route details';
const requirements = 'Special requirements';
const status = 'Pending';

// Insert a booking for the example driver and client
insertBooking(driverId, clientId, startDate, endDate, route, requirements, status);
