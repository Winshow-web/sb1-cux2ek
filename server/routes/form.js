import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import verifyToken from "../middleware/auth.js";
import {supabase} from "../db/index.js";

// Set up multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('photo');  // Single file upload

const router = express.Router();

// Helper function to convert buffer to JPG using sharp
const convertToJPG = async (buffer) => {
    try {
        return await sharp(buffer)
            .jpeg({quality: 90}) // Convert image to JPG with 90% quality
            .toBuffer();
    } catch (error) {
        throw new Error("Error converting image to JPG");
    }
};

// Helper function to generate signed URL
const generateSignedUrl = async (fileName) => {
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('ProfilePictures')
        .createSignedUrl(fileName, 60 * 60);  // Valid for 1 hour

    if (signedUrlError) {
        throw new Error('Error generating signed URL');
    }

    return signedUrlData.signedUrl;
};

// Profile picture upload and user registration route
router.post('/driver', verifyToken, upload, async (req, res) => {
    const { name, email, phone, experience, licenseType, specializations, serviceArea } = req.body;
    const photo = req.file;  // The uploaded photo

    if (!photo) {
        console.log("No photo uploaded");
        return res.status(400).json({ message: 'Photo is required' });
    }

    const userId = req.user.id;  // Get the authenticated user's ID from token
    const fileName = `${userId}.jpg`; // Standardize to .jpg

    try {
        // Check if the file already exists in the bucket
        const { data: existingFile, error: existingFileError } = supabase.storage
            .from('ProfilePictures')
            .getPublicUrl(fileName); // Get the public URL (if it exists)

        // If file exists, delete it (this would be the "replace" logic)
        if (existingFile && !existingFileError) {
            const { error: deleteError } = await supabase.storage
                .from('ProfilePictures')
                .remove([fileName]);
            if (deleteError) {
                console.error("Error deleting existing photo:", deleteError);
                return res.status(500).json({ error: 'Error deleting existing photo' });
            }
        }

        // Convert the image to JPG format using sharp
        const jpgBuffer = await convertToJPG(photo.buffer);

        // Upload the converted image to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('ProfilePictures')
            .upload(fileName, jpgBuffer, {
                contentType: 'image/jpg', // Specify the correct content type
                upsert: false,  // Don't overwrite if it exists, already handled by delete logic
            });

        if (uploadError) {
            console.error("Error uploading photo:", uploadError);
            return res.status(500).json({ error: 'Error uploading photo' });
        }

        // Generate signed URL for accessing the image (valid for 1 hour)
        const photoUrl = await generateSignedUrl(fileName);

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

        res.status(201).json({
            message: 'Driver registration successful',
            data: newDriver,
        });

    } catch (error) {
        console.error("Error during driver registration:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/client', verifyToken, upload, async (req, res) => {
    const { name, email, phone } = req.body;
    const photo = req.file; // The uploaded photo

    if (!photo) {
        console.log("No photo uploaded");
        return res.status(400).json({ message: 'Photo is required' });
    }

    const userId = req.user.id; // Get the authenticated user's ID from token
    const fileName = `${userId}.jpg`; // Standardize to .jpg

    try {
        // Check if the file already exists in the bucket
        const { data: existingFile, error: existingFileError } = supabase.storage
            .from('ProfilePictures')
            .getPublicUrl(fileName);

        // If file exists, delete it (this would be the "replace" logic)
        if (existingFile && !existingFileError) {
            const { error: deleteError } = await supabase.storage
                .from('ProfilePictures')
                .remove([fileName]);
            if (deleteError) {
                console.error("Error deleting existing photo:", deleteError);
                return res.status(500).json({ error: 'Error deleting existing photo' });
            }
        }

        // Convert the image to JPG format using sharp
        const jpgBuffer = await convertToJPG(photo.buffer);

        // Upload the converted image to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('ProfilePictures')
            .upload(fileName, jpgBuffer, {
                contentType: 'image/jpg',
                upsert: false,
            });

        if (uploadError) {
            console.error("Error uploading photo:", uploadError);
            return res.status(500).json({ error: 'Error uploading photo' });
        }

        // Generate signed URL for accessing the image (valid for 1 hour)
        const photoUrl = await generateSignedUrl(fileName);

        // Insert client data into the database
        const { data: newClient, error: insertError } = await supabase
            .from('Client Requests')
            .insert([{
                id: userId,
                name,
                email,
                phone,
                photo: photoUrl, // Store the URL of the photo
            }]);

        if (insertError) {
            console.error("Error inserting client data:", insertError);
            return res.status(500).json({ error: 'Error inserting client data' });
        }

        res.status(201).json({
            message: 'Client registration successful',
            data: newClient,
        });

    } catch (error) {
        console.error("Error during client registration:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/load', verifyToken, async (req, res) => {
    const userId = req.user.id;  // Get the authenticated user's ID from the token

    try {
        // Fetch the related driver or client data based on the user ID
        let userRegistrationData = null;

        const { data: driverData, error: driverError } = await supabase
            .from('Driver Requests')
            .select('*')
            .eq('id', userId)
            .single();

        if (driverData) {
            userRegistrationData = { type: 'driver', data: driverData };
        } else {
            const { data: clientData, error: clientError } = await supabase
                .from('Client Requests')
                .select('*')
                .eq('id', userId)
                .single();

            if (clientData) {
                userRegistrationData = { type: 'client', data: clientData };
            }
        }

        if (!userRegistrationData) {
            return res.status(404).json({ error: 'No registration data found for this user.' });
        }

        // Generate signed URL for the user's profile picture
        const { data: signedUrl, error: urlError } = await supabase
            .storage
            .from('ProfilePictures')
            .createSignedUrl(`${userId}.jpg`, 60 * 60); // Signed URL valid for 1 hour

        if (urlError) {
            console.error(`Error generating signed URL for ID ${userId}:`, urlError);
            return res.status(500).json({ error: 'Error generating signed URL for profile picture' });
        }

        // Add photo to the registration data
        userRegistrationData.data.photo = signedUrl.signedUrl; // Add signed URL to the user registration data

        // Return the response with the photo included
        res.status(200).json({
            message: 'User data loaded successfully',
            registrationData: userRegistrationData,
        });

    } catch (error) {
        console.error("Error loading user data:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
