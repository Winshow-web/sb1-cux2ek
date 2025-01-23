import express from "express";

import clientFormRouter from './clientform.js';
import driverFormRouter from './driverform.js';

const router = express.Router();

router.use('/client', clientFormRouter);
router.use('/driver', driverFormRouter);

export default router;