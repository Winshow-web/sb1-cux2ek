import verifyToken from "../middleware/auth.js";
import { supabase } from "../db/index.js";
import express from "express";

const loadRouter = express.Router();
loadRouter.use(express.json());

loadRouter.post('/drivers', verifyToken, async (req, res) => {
    const { driver_ids } = req.body;

    if (!driver_ids || !Array.isArray(driver_ids) || driver_ids.length === 0) {
        return res.status(400).json({ error: 'driver_ids is required and must be an array' });
    }

    try {
        const { data: driverProfiles, error } = await supabase
            .from('Drivers')
            .select('*')
            .in('id', driver_ids);

        if (error) {
            return res.status(500).json({ error: 'Error fetching driver profiles' });
        }

        if (driverProfiles.length === 0) {
            return res.status(404).json({ error: 'No drivers found for the provided IDs' });
        }

        // Generate signed URLs for profile pictures
        for (let driverProfile of driverProfiles) {
            const { data: signedUrl, error: urlError } = await supabase
                .storage
                .from('ProfilePictures')
                .createSignedUrl(`${driverProfile.id}.jpg`, 60 * 60);

            if (urlError) {
                console.error(`Error generating signed URL for driver ID ${driverProfile.id}:`, urlError);
                driverProfile.photo = null;
            } else {
                driverProfile.photo = signedUrl.signedUrl;
            }
        }

        res.status(200).json(driverProfiles);
    } catch (error) {
        console.error("Server error fetching driver profiles:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default loadRouter;
