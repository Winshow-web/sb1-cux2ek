import verifyToken from "../../middleware/auth.js";
import { supabase } from "../../db/index.js";
import express from "express";

const driverBookings = express.Router();
driverBookings.use(express.json());

driverBookings.post('/finalize', verifyToken, async (req, res) => {
    const { bookingId, driverId } = req.body
    if (!bookingId || !driverId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {

        const { data, error } = await supabase
            .schema('booking_request')
            .rpc('finalize_booking_request', { p_booking_id: bookingId, driver_id: driverId });

        if (error) {
            return res.status(500).json({ error: 'Error finalizing booking request: ' + error.message });
        }

        return res.status(200).json({ message: 'Finalized booking request successfully', data });
    } catch (err) {
        console.log('3');
        console.error('Error finalizing the booking request:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

driverBookings.post('/apply', verifyToken, async (req, res) => {
    const { bookingId, driverId } = req.body
    if (!bookingId || !driverId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {

        const { data, error } = await supabase
            .schema('booking_request')
            .rpc('append_to_driver_ids', { p_booking_id: bookingId, driver_id: driverId });

        if (error) {
            return res.status(500).json({ error: 'Error applying to the booking: ' + error.message });
        }

        return res.status(200).json({ message: 'Applied to booking successfully', data });
    } catch (err) {
        console.log('3');
        console.error('Error applying to a booking:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

driverBookings.get('/load', verifyToken, async (req, res) => {
    const { driverId } = req.query;

    if (!driverId) {
        return res.status(400).json({ error: 'Driver ID is required' });
    }

    try {
        const { data, error } = await supabase
            .schema('booking')
            .from('bookings')
            .select('*')
            .eq('driver_id', driverId);

        if (error) {
            return res.status(500).json({ error: 'Error loading bookings: ' + error.message });
        }

        return res.status(200).json({ message: 'Bookings retrieved successfully', data });
    } catch (err) {
        console.error('Error loading bookings:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

driverBookings.get('/load_request', verifyToken, async (req, res) => {

    try {
        const { data, error } = await supabase
            .schema('booking_request')
            .from('booking_requests')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(30);

        if (error) {
            return res.status(500).json({ error: 'Error loading booking requests: ' + error.message });
        }

        return res.status(200).json({ message: 'Booking requests retrieved successfully', data });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default driverBookings;