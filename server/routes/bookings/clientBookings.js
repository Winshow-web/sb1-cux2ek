import verifyToken from "../../middleware/auth.js";
import { supabase } from "../../db/index.js";
import express from "express";

const clientBookings = express.Router();
clientBookings.use(express.json());

clientBookings.post('/submit', verifyToken, async (req, res) => {
    const { clientId, startDate, endDate, route, requirements } = req.body;

    //console.log(req.body);

    if (!clientId || !startDate || !endDate || !route || !requirements) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {

        //console.log('Booking: ' + req.body);

        // Insert the new booking into the bookings table
        const { data, error } = await supabase
            .schema('booking_request')
            .from('booking_requests')
            .insert([
                {
                    client_id: clientId,
                    start_date: startDate,
                    end_date: endDate,
                    route: route,
                    requirements: requirements,
                }
            ]);

        if (error) {
            //console.log("error: " + error);
            return res.status(500).json({ error: 'Error inserting booking: ' + error.message });
        }

        return res.status(200).json({ message: 'Booking inserted successfully', data });
    } catch (err) {
        console.error('Error inserting booking:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

clientBookings.post('/select', verifyToken, async (req, res) => {
    const { bookingId, driverId } = req.body;

    if (!bookingId || !driverId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {

        const { data, error } = await supabase
            .schema('booking_request')
            .rpc('select_driver', { p_booking_id: bookingId, driver_id: driverId });

        if (error) {
            return res.status(500).json({ error: 'Error selecting the driver: ' + error.message });
        }

        return res.status(200).json({ message: 'Driver selected successfully', data });
    } catch (err) {
        console.error('Error selecting the driver:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

clientBookings.get('/load', verifyToken, async (req, res) => {
    const { clientId } = req.query;

    if (!clientId) {
        return res.status(400).json({ error: 'Client ID is required' });
    }

    try {
        const { data, error } = await supabase
            .schema('booking')
            .from('bookings')
            .select('*')
            .eq('client_id', clientId);

        if (error) {
            return res.status(500).json({ error: 'Error loading bookings: ' + error.message });
        }

        return res.status(200).json({ message: 'Bookings retrieved successfully', data });
    } catch (err) {
        console.error('Error loading bookings:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

clientBookings.get('/load_request', verifyToken, async (req, res) => {
    const { clientId } = req.query;

    if (!clientId) {
        return res.status(400).json({ error: 'Client ID is required' });
    }

    try {
        // Retrieve bookings for the given client_id
        const { data, error } = await supabase
            .schema('booking_request')
            .from('booking_requests')
            .select('*')
            .eq('client_id', clientId);

        //console.log(data);

        if (error) {
            return res.status(500).json({ error: 'Error loading bookings: ' + error.message });
        }

        return res.status(200).json({ message: 'Bookings retrieved successfully', data });
    } catch (err) {
        console.error('Error loading bookings:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default clientBookings;
