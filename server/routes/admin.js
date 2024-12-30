import express from 'express';

import loadFormsRouter from "./admin/loadForms.js";
import loadProfilesRouter from "./admin/loadProfiles.js";
import processRequestRouter from "./admin/processRequest.js";

const adminRouter = express.Router();
adminRouter.use(express.json());

adminRouter.use('/forms', loadFormsRouter);
adminRouter.use('/profiles', loadProfilesRouter);
adminRouter.use('/request', processRequestRouter);

export default adminRouter;