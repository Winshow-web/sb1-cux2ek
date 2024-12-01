import express from 'express';
import multer from 'multer';
import verifyToken from "../middleware/auth.js";
import { supabase } from "../db/index.js";

// Set up multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('photo');  // Single file upload

const router = express.Router();

// Driver registration route
router.post('/driver', verifyToken, upload, async (req, res) => {
    const { name, email, phone, experience, licenseType, specializations, serviceArea } = req.body;
    const photo = req.file;  // The uploaded photo

    // Ensure photo is uploaded
    if (!photo) {
        console.log("No photo uploaded");
        return res.status(400).json({ message: 'Photo is required' });
    }

    const userId = req.user.id;  // Get the authenticated user's ID from token

    try {
        // Check if driver registration already exists for the user
        const { data: existingDriver, error: existingDriverError } = await supabase
            .from('Driver Requests')
            .select('id')
            .eq('id', userId)
            .single();

        if (existingDriver) {
            console.log("Driver form already exists for this user");
            return res.status(400).json({ message: 'Driver form already exists for this user.' });
        }

        // Convert file buffer to ArrayBuffer for upload
        const arrayBuffer = photo.buffer;
        const fileExtension = photo.originalname.split('.').pop();
        const fileName = `${userId}.${fileExtension}`;

        // Upload photo to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('ProfilePictures')
            .upload(`Drivers/${fileName}`, arrayBuffer, {
                contentType: photo.mimetype,
                upsert: false  // Don't overwrite existing files
            });

        if (uploadError) {
            console.error("Error uploading photo:", uploadError);
            return res.status(500).json({ error: 'Error uploading photo' });
        }

        // Generate a signed URL to access the uploaded photo
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from('ProfilePictures')
            .createSignedUrl(`Drivers/${fileName}`, 60 * 60); // Valid for 1 hour

        if (signedUrlError) {
            console.error("Error generating signed URL:", signedUrlError);
            return res.status(500).json({ error: 'Error generating signed URL' });
        }

        const photoUrl = signedUrlData.signedUrl;

        // Insert driver data into the database
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
                photo: photoUrl,  // Store the URL of the photo
            }]);

        if (insertError) {
            console.error("Error inserting driver data:", insertError);
            return res.status(500).json({ error: 'Error inserting driver data' });
        }

        console.log("Driver registration successful:", newDriver);

        res.status(201).json({
            message: 'Driver registration successful',
            data: newDriver,  // Return all fields except ID
        });

    } catch (error) {
        console.error("Error during driver registration:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// TODO: 1 After successful form submission, change account type to ..._pending

// TODO: 2 Add client form route

// TODO: 3 Add form fetch route

export default router;
