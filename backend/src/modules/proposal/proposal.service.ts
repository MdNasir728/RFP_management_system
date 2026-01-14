import { google } from "googleapis";
import { env } from "../../config/env";
import { ProposalModel } from "./proposal.model";
import { mapProposalDocumentToProposal } from "./proposal.mapper";
import { VendorModel } from "../vendor/vendor.model";
import { RfpModel } from "../rfp/rfp.model";
import { RfpStatus, AiConfidenceLevel, Proposal } from "../../shared";

/**
 * Initialize Gmail client
 */
const oAuth2Client = new google.auth.OAuth2(
  env.GMAIL_CLIENT_ID,
  env.GMAIL_CLIENT_SECRET
);

oAuth2Client.setCredentials({
  refresh_token: env.GMAIL_REFRESH_TOKEN
});

const gmail = google.gmail({
  version: "v1",
  auth: oAuth2Client
});

/**
 * TEMP AI PARSER (Mock)
 * --------------------
 * Converts messy vendor email text into structured proposal data.
 * Will be replaced with real AI parsing later.
 */
const mockAiParseProposal = async (emailBody: string) => {
  return {
    confidence: AiConfidenceLevel.MEDIUM,
    missingFields: [],
    notes: emailBody.slice(0, 200)
  };
};

/**
 * Fetch vendor replies from Gmail inbox and create proposals.
 */
export const fetchVendorRepliesAndCreateProposals =
  async (): Promise<Proposal[]> => {
    const proposals: Proposal[] = [];

    // Fetch latest emails (simple demo approach)
    const res = await gmail.users.messages.list({
      userId: "me",
      q: "RFP-ID:",
      maxResults: 10
    });

    const messages = res.data.messages || [];

    for (const message of messages) {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: message.id!
      });

      const headers = msg.data.payload?.headers || [];

      const fromHeader = headers.find((h) => h.name === "From")?.value;
      const subjectHeader = headers.find((h) => h.name === "Subject")?.value;

      if (!fromHeader || !subjectHeader) continue;

      // Extract RFP ID from subject
      const rfpIdMatch = subjectHeader.match(/RFP-ID:([a-f0-9]+)/i);
      if (!rfpIdMatch) continue;

      const rfpId = rfpIdMatch[1];

      const vendor = await VendorModel.findOne({
        email: fromHeader.match(/<(.+)>/)?.[1] || fromHeader,
        isActive: true
      });

      if (!vendor) continue;

      const rfp = await RfpModel.findById(rfpId);
      if (!rfp) continue;

      // Extract email body (plain text only, demo-safe)
      const bodyData =
        msg.data.payload?.body?.data ||
        msg.data.payload?.parts?.[0]?.body?.data;

      if (!bodyData) continue;

      const emailBody = Buffer.from(bodyData, "base64").toString("utf-8");

      // AI parsing (mock)
      const parsedData = await mockAiParseProposal(emailBody);

      const proposalDoc = await ProposalModel.create({
        rfpId,
        vendorId: vendor._id.toString(),
        rawResponseText: emailBody,
        parsedData
      });

      proposals.push(mapProposalDocumentToProposal(proposalDoc));

      // Update RFP status
      if (rfp.status === RfpStatus.SENT) {
        rfp.status = RfpStatus.RESPONSES_RECEIVED;
        await rfp.save();
      }
    }

    return proposals;
  };
