import { Router } from "express";
import { sendRfpEmailsHandler } from "./email.controller";

const router = Router();

/**
 * Email routes
 */
router.post("/send-rfp", sendRfpEmailsHandler);

export default router;
