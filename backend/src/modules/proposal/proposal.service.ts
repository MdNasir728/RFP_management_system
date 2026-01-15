import { google } from "googleapis";
import { ProposalModel } from "./proposal.model";
import { mapProposalDocumentToProposal } from "./proposal.mapper";
import { VendorModel } from "../vendor/vendor.model";
import { RfpModel } from "../rfp/rfp.model";
import { RfpStatus, Proposal } from "../../shared";
import { env } from "../../config/env";

/* AI imports */
import { callOllama } from "../../ai/ai.client";
import {
  SYSTEM_JSON_ONLY_PROMPT,
  buildProposalParsingPrompt
} from "../../ai/ai.prompts";
import {
  parseJsonStrict,
  validateParsedProposal
} from "../../ai/ai.parsers";

/* ---------------- GMAIL CLIENT ---------------- */

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

/* ---------------- SERVICE ---------------- */

/**
 * Fetch vendor replies from Gmail and create proposals
 */
export const fetchVendorRepliesAndCreateProposals =
  async (): Promise<Proposal[]> => {
    const created: Proposal[] = [];

    // Existing proposals (for deduplication)
    const existing = await ProposalModel.find({});
    const existingPairs = new Set(
      existing.map((p) => `${p.rfpId}_${p.vendorId}`)
    );

    // 1️⃣ Fetch emails containing RFP-ID
    const listRes = await gmail.users.messages.list({
      userId: "me",
      q: "RFP-ID:",
      maxResults: 20
    });

    const messages = listRes.data.messages || [];

    for (const msgMeta of messages) {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: msgMeta.id!
      });

      const headers = msg.data.payload?.headers || [];

      const subject =
        headers.find((h) => h.name === "Subject")?.value || "";
      const from =
        headers.find((h) => h.name === "From")?.value || "";

      // 2️⃣ Extract RFP ID from subject
      const match = subject.match(/RFP-ID:([a-f0-9]+)/i);
      if (!match) continue;

      const rfpId = match[1];

      // 3️⃣ Find vendor by sender email
      const senderEmail =
        from.match(/<(.+)>/)?.[1] || from;

      const vendor = await VendorModel.findOne({
        email: senderEmail
      });

      if (!vendor) continue;

      const dedupeKey = `${rfpId}_${vendor._id.toString()}`;
      if (existingPairs.has(dedupeKey)) continue;

      // 4️⃣ Extract email body (plain text)
      const bodyData =
        msg.data.payload?.body?.data ||
        msg.data.payload?.parts?.[0]?.body?.data;

      if (!bodyData) continue;

      const proposalText = Buffer.from(
        bodyData,
        "base64"
      ).toString("utf-8");

      const rfp = await RfpModel.findById(rfpId);
      if (!rfp) continue;

      // 5️⃣ AI PARSING (REAL)
      let parsedData;

      try {
        const aiResponse = await callOllama(
          buildProposalParsingPrompt(
            proposalText,
            rfp.rawText
          ),
          SYSTEM_JSON_ONLY_PROMPT
        );

        const parsed = parseJsonStrict<any>(aiResponse);
        parsedData = validateParsedProposal(parsed);
      } catch (err) {
        parsedData = {
          pricing: null,
          deliveryTimeline: null,
          paymentTerms: null,
          warranty: null,
          confidence: "LOW",
          missingFields: ["AI parsing failed"]
        };
      }

      // 6️⃣ Save proposal
      const proposalDoc = await ProposalModel.create({
        rfpId,
        vendorId: vendor._id.toString(),
        rawResponseText: proposalText,
        parsedData
      });

      created.push(mapProposalDocumentToProposal(proposalDoc));

      // 7️⃣ Update RFP status
      if (rfp.status === RfpStatus.SENT) {
        rfp.status = RfpStatus.RESPONSES_RECEIVED;
        await rfp.save();
      }
    }

    return created;
  };
