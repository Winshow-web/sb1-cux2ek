import express from "express";
import verifyToken from "./middleware/auth.js";

import authRouter from "./routes/auth/auth.js";
import verifyRouter from "./routes/verify/verify.js";
import formRouter from "./routes/form/form.js";

const router = express.Router();

// TODO : Change the responses to not include sensitive data

router.use('/auth', authRouter);

router.use(verifyToken);

router.use('/verify', verifyRouter);
router.use('/form', formRouter);

export default router;