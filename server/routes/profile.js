import verifyToken from "../middleware/auth.js";
import { supabase } from "../db/index.js";
import express from "express";

const profileRouter = express.Router();
profileRouter.use(express.json());

// Load driver profile by ID
profileRouter.get('/driver/:id', verifyToken, async (req, res) => {
    const { id } = req.params; // Extract ID from URL parameters

    try {
        // Fetch the driver form by ID
        const { data: driverProfile, error } = await supabase
            .from('Drivers')
            .select('*')
            .eq('id', id) // Match by ID
            .single(); // Ensure only one record is returned

        if (error) {
            console.error("Error fetching driver form:", error);
            return res.status(500).json({ error: 'Error fetching driver form' });
        }

        if (!driverProfile) {
            return res.status(404).json({ error: 'Driver not found' });
        }

        // Generate signed URL for photo
        const { data: signedUrl, error: urlError } = await supabase
            .storage
            .from('ProfilePictures')
            .createSignedUrl(`${driverProfile.id}.jpg`, 60 * 60); // Signed URL valid for 1 hour

        if (urlError) {
            console.error(`Error generating signed URL for driver ID ${driverProfile.id}:`, urlError);
            driverProfile.photo = null; // Attach null if URL generation fails
        } else {
            driverProfile.photo = signedUrl.signedUrl; // Attach signed URL as "photo"
        }

        res.status(200).json(driverProfile);
    } catch (error) {
        console.error("Server error fetching driver form:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Load client profile by ID
profileRouter.get('/client/:id', verifyToken, async (req, res) => {
    const { id } = req.params; // Extract ID from URL parameters

    try {
        // Fetch the client form by ID
        const { data: clientProfile, error } = await supabase
            .from('Clients')
            .select('*')
            .eq('id', id) // Match by ID
            .single(); // Ensure only one record is returned

        if (error) {
            console.error("Error fetching client form:", error);
            return res.status(500).json({ error: 'Error fetching client form' });
        }

        if (!clientProfile) {
            return res.status(404).json({ error: 'Client not found' });
        }

        // Generate signed URL for photo
        const { data: signedUrl, error: urlError } = await supabase
            .storage
            .from('ProfilePictures')  // Assuming 'ProfilePictures' is the storage bucket name
            .createSignedUrl(`${clientProfile.id}.jpg`, 60 * 60); // Signed URL valid for 1 hour

        if (urlError) {
            console.error(`Error generating signed URL for client ID ${clientProfile.id}:`, urlError);
            clientProfile.photo = null; // Attach null if URL generation fails
        } else {
            clientProfile.photo = signedUrl.signedUrl; // Attach signed URL as "photo"
        }

        res.status(200).json(clientProfile); // Send back the client form with signed photo
    } catch (error) {
        console.error("Server error fetching client form:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default profileRouter;
