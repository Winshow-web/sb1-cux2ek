import verifyToken from "../../middleware/auth.js";
import { supabase } from "../../db/index.js";
import express from "express";

const processRequestRouter = express.Router();
processRequestRouter.use(express.json());

processRequestRouter.post('/approve', verifyToken, async (req, res) => {
    const { account_type, id } = req.body;

    try {
        // Check if account_type is valid
        if (account_type !== 'client' && account_type !== 'driver') {
            return res.status(400).json({ error: 'Invalid account type' });
        }

        // Call the appropriate Supabase RPC function based on account_type
        let functionName;
        if (account_type === 'client') {
            functionName = 'approve_client_request';
        } else if (account_type === 'driver') {
            functionName = 'approve_driver_request';
        }

        // Call the Supabase RPC function
        const { data, error } = await supabase
            .rpc(functionName, { request_id: id });

        if (error) {
            console.error("Error in RPC call:", error);
            return res.status(500).json({ error: 'Error approving request' });
        }

        // Handle success response from RPC
        if (data.error) {
            return res.status(400).json(data); // Error message from the RPC function
        }

        return res.status(200).json(data); // Success message from the RPC function
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});




processRequestRouter.post('/reject', verifyToken, async (req, res) => {
    const { account_type, id } = req.body;

    try {
        // Fetch data based on account type
        let tableName = '';

        if (account_type === 'client') { tableName = 'Clients Requests'; }
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