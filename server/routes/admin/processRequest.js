import verifyToken from "../../middleware/auth.js";
import { supabase } from "../../db/index.js";
import express from "express";

const processRequestRouter = express.Router();
processRequestRouter.use(express.json());

processRequestRouter.post('/approve', verifyToken, async (req, res) => {
    const { account_type, id } = req.body;

    try {
        // Determine the table name for request and target table based on account type
        let requestTable = '';
        let targetTable = '';
        if (account_type === 'client') {
            requestTable = 'Client Requests';
            targetTable = 'Clients';
        } else if (account_type === 'driver') {
            requestTable = 'Driver Requests';
            targetTable = 'Drivers';
        } else {
            return res.status(400).json({ error: 'Invalid account type' });
        }

        // Fetch the request data based on the account type
        const { data: requestData, error: fetchError } = await supabase
            .from(requestTable)
            .select('*')
            .eq('id', id)
            .limit(1)
            .single();

        if (fetchError) {
            console.error(" 1 Error fetching request form:", fetchError);
            return res.status(500).json({ error: 'Error fetching request form' });
        }

        if (!requestData) {
            return res.status(404).json({ error: 'Request form not found' });
        }

        // Check if the data already exists in the target table (Clients or Drivers) by the unique id
        const { data: existingData, error: checkError } = await supabase
            .from(targetTable)
            .select('*')
            .eq('id', requestData.id)  // The 'id' is the unique identifier (UUID)
            .maybeSingle();

        if (checkError && existingData) {
            console.error("Error checking for existing data:", checkError);
            return res.status(500).json({ error: 'Error checking for existing data' });
        }

        // Prepare the data to be inserted into the target table
        const insertData = {
            id: requestData.id,  // Ensure we're inserting the same UUID as the request ID
            name: requestData.name,
            email: requestData.email,
            phone: requestData.phone,
        };

        if (account_type === 'driver') {
            // Add extra fields for the Driver table
            insertData.experience = requestData.experience;
            insertData.rating = -1;
            insertData.license_type = requestData.license_type;
            insertData.specializations = requestData.specializations;
            insertData.service_area = requestData.service_area;
            insertData.availability = false;
        }

        // Insert the data into the target table (Client or Driver)
        const { data: insertedData, error: insertError } = await supabase
            .from(targetTable)
            .insert([insertData]);

        if (insertError) {
            console.error("Error inserting data into target table:", insertError);
            return res.status(500).json({ error: 'Error inserting data into target table' });
        }

        // Delete the approved request from the request table
        const { error: deleteError } = await supabase
            .from(requestTable)
            .delete()
            .eq('id', id);

        if (deleteError) {
            console.error("Error deleting request form:", deleteError);
            return res.status(500).json({ error: 'Error deleting request form' });
        }

        res.status(200).json({ message: `${account_type} form approved and data inserted successfully.` });
    } catch (error) {
        console.error("Error approving form:", error);
        res.status(500).json({ error: 'Server error' });
    }
});


processRequestRouter.post('/reject', verifyToken, async (req, res) => {
    const { account_type, id } = req.body;

    try {
        // Fetch data based on account type
        let tableName = '';

        if (account_type === 'client') { tableName = 'Client Requests'; }
        else if (account_type === 'driver') { tableName = 'Driver Requests'; }
        else { return res.status(400).json({ error: 'Invalid account type' }); }

        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq('id', id)
            .limit(1)
            .single();

        if (error) {
            console.error("Error fetching form:", error);
            return res.status(500).json({ error: 'Error fetching form' });
        }

        let response = await supabase
            .from(tableName)
            .update({ status: 'rejected' })
            .eq('id', id);

        if (response.error) {
            console.error("Error rejecting form:", response.error);
            return res.status(500).json({ error: 'Error rejecting form' });
        }

        res.status(200).json({ message: `${account_type} form rejected successfully.` });
    } catch (error) {
        console.error("Error rejecting form:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default processRequestRouter;