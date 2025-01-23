import express from "express";
import {convertToJPG, generateSignedUrl, upload} from "./functions.js";
import {supabase} from "../../supabase/index.js";

const router = express.Router();

router.post('/', upload, async (req, res) => {
    const { name, email, phone, experience, licenseType, specializations, serviceArea } = req.body;
    const photo = req.file;  // The uploaded photo

    if (!name || !email || !experience || !licenseType || !specializations || !serviceArea || !photo) {
        return res.status(400).json({
            message: "Missing required fields. Please ensure all fields are filled in."
        });
    }

    const userId = req.user.id;  // Get the authenticated user's ID from token
    const fileName = `${userId}.jpg`; // Standardize to .jpg

    try {

        const jpgBuffer = await convertToJPG(photo.buffer);

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('ProfilePictures')
            .upload(fileName, jpgBuffer, {
                contentType: 'image/jpg', // Specify the correct content type
                upsert: true,  // Don't overwrite if it exists, already handled by delete logic
            });

        if (uploadError) {
            console.error("Error uploading photo:", uploadError);
            return res.status(500).json({ error: 'Error uploading photo' });
        }

        const { data: newDriver, error: insertError } = await supabase
            .from('Driver Requests')
            .insert([{
                id: userId,
                name,
                email,
                phone,
                experience,
                license_type: licenseType,
                specializations: specializations.split(','),
                service_area: serviceArea,
            }]);


        if (insertError) {
            console.error("Error inserting driver data:", insertError);
            return res.status(500).json({ error: 'Error inserting driver data' });
        }

        const photoUrl = await generateSignedUrl(fileName);

        res.status(201).json({
            message: 'Driver registration successful'
        });

    } catch (error) {
        console.error("Error during driver registration:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;