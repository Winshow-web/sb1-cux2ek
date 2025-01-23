 import express from "express";
import {convertToJPG, generateSignedUrl, upload} from "./functions.js";
import {supabase} from "../../supabase/index.js";

const router = express.Router();


router.post('/', upload, async (req, res) => {
    const { name, email, phone } = req.body;
    const photo = req.file; // The uploaded photo

    if (!name || !email || !phone || !photo) {
        return res.status(400).json({ message: 'Missing form info!' });
    }

    if (!photo) {
        console.log("No photo uploaded");
        return res.status(400).json({ message: 'Photo is required' });
    }

    console.log(req.headers.authorization);

    const userId = req.user.id; // Get the authenticated user's ID from token
    const fileName = `${userId}.jpg`; // Standardize to .jpg

    try {
        // Convert the image to JPG format using sharp
        const jpgBuffer = await convertToJPG(photo.buffer);

        // Upload the converted image to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('ProfilePictures')
            .upload(fileName, jpgBuffer, {
                contentType: 'image/jpg',
                upsert: true,
            });

        if (uploadError) {
            console.error("Error uploading photo:", uploadError);
            return res.status(500).json({ error: 'Error uploading photo' });
        }

        // Insert client data into the database
        const { data: newClient, error: insertError } = await supabase
            .from('Client Requests')
            .insert([{
                id: userId,
                name,
                email,
                phone
            }]);

        if (insertError) {
            console.error("Error inserting client data:", insertError);
            return res.status(500).json({ error: 'Error inserting client data' });
        }

        // Generate signed URL for accessing the image (valid for 1 hour)
        const photoUrl = await generateSignedUrl(fileName);

        res.status(201).json({
            message: 'Clients registration successful',
            data: {newClient, photoUrl},
        });

    } catch (error) {
        console.error("Error during client registration:", error);
        res.status(500).json({ error: 'Server error' });
    }
});


export default router;