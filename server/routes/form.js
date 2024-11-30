import express from 'express';
import multer from 'multer';
import { body, validationResult } from 'express-validator';
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Validation middleware for driver form
const driverFormValidator = [
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').isString().notEmpty().withMessage('Phone number is required'),
    body('experience').isString().notEmpty().withMessage('Experience is required'),
    body('licenseType').isString().notEmpty().withMessage('License type is required'),
    body('specializations').isString().notEmpty().withMessage('Specializations are required'),
    body('serviceArea').isString().notEmpty().withMessage('Service area is required'),
];

// POST route to handle driver registration
router.post(
    '/driver',
    verifyToken, // Protect the route with token verification
    upload.single('photo'), // Handle photo uploads
    ...driverFormValidator, // Spread the validation middleware
    async (req, res) => {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, phone, experience, licenseType, specializations, serviceArea } = req.body;
        const photo = req.file; // The uploaded photo file will be available here

        try {
            // Prepare the response data
            const responseData = {
                name,
                email,
                phone,
                experience: parseInt(experience, 10),
                licenseType,
                specializations: specializations.split(','),
                serviceArea,
                photo: photo ? photo.originalname : null,
            };

            // Respond to the client
            res.status(201).json({
                message: 'Driver registration successful',
                data: responseData,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong' });
        }
    }
);

export default router;
