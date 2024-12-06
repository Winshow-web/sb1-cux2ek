import express from 'express';
import verifyToken from "../middleware/auth.js";
import { supabase } from "../db/index.js";

const router = express.Router();

router.get('/drivers', verifyToken, async (req, res) => {
    try {
        // Fetch driver forms
        const { data: driverForms, error } = await supabase
            .from('Driver Requests')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) {
            console.error("Error fetching driver forms:", error);
            return res.status(500).json({ error: 'Error fetching driver forms' });
        }

        if (driverForms.length === 0) {
            return res.status(200).json([]);
        }

        // Generate signed URL for the user's profile picture
        const driverFormsWithPhotos = await Promise.all(driverForms.map(async (form) => {
            const { data: signedUrl, error: urlError } = await supabase
                .storage
                .from('ProfilePictures')
                .createSignedUrl(`${form.id}.jpg`, 60 * 60); // Signed URL valid for 1 hour

            if (urlError) {
                console.error(`Error generating signed URL for ID ${form.id}:`, urlError);
                return { ...form, photo: null }; // Attach null if URL generation fails
            }

            return { ...form, photo: signedUrl.signedUrl }; // Attach signed URL as "photo"
        }));

        res.status(200).json(driverFormsWithPhotos);
    } catch (error) {
        console.error("Server error fetching driver forms:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/clients', verifyToken, async (req, res) => {
    try {
        const { data: clientForms, error } = await supabase
            .from('Client Requests')
            .select('*')
            .order('created_at', { ascending: false }) // Assuming 'created_at' stores the timestamp
            .limit(50);

        if (error) {
            console.error("Error fetching client forms:", error);
            return res.status(500).json({ error: 'Error fetching client forms' });
        }

        res.status(200).json(clientForms);
    } catch (error) {
        console.error("Server error fetching client forms:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;