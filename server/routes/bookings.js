import express from 'express';

import clientBookings from "./bookings/clientBookings.js";
import driverBookings from "./bookings/driverBookings.js";

const bookingsRouter = express.Router();
bookingsRouter.use(express.json());

bookingsRouter.use('/client', clientBookings);
bookingsRouter.use('/driver', driverBookings);

export default bookingsRouter;