import { Router } from "express";
import {
  fetchVendorRepliesHandler,
  getProposalsHandler
} from "./proposal.controller";

const router = Router();

router.post(
  "/fetch-replies",
  fetchVendorRepliesHandler
);

router.get("/", getProposalsHandler);

export default router;
