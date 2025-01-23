import {supabase} from "../../supabase/index.js";
import multer from "multer";
import sharp from "sharp";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('photo');  // Single file upload

const convertToJPG = async (buffer) => {
    try {
        return await sharp(buffer)
            .jpeg({quality: 90}) // Convert image to JPG with 90% quality
            .toBuffer();
    } catch (error) {
        throw new Error("Error converting image to JPG");
    }
};

const generateSignedUrl = async (fileName) => {
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('ProfilePictures')
        .createSignedUrl(fileName, 60 * 60);  // Valid for 1 hour

    if (signedUrlError) {
        throw new Error('Error generating signed URL');
    }

    return signedUrlData.signedUrl;
};

export { upload, convertToJPG, generateSignedUrl };