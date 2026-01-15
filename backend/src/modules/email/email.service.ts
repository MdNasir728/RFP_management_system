import { google } from "googleapis";
import { env } from "../../config/env";
import { RfpModel } from "../rfp/rfp.model";
import { VendorModel } from "../vendor/vendor.model";
import { RfpStatus } from "../../shared";

/* ------------------------------------------------------------------ */
/* ENV VALIDATION */
/* ------------------------------------------------------------------ */
if (
  !env.GMAIL_CLIENT_ID ||
  !env.GMAIL_CLIENT_SECRET ||
  !env.GMAIL_REFRESH_TOKEN
) {
  throw new Error("❌ Gmail OAuth credentials are missing in .env");
}

/* ------------------------------------------------------------------ */
/* GMAIL CLIENT SETUP */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/* EMAIL BODY BUILDER (CRITICAL FIX HERE) */
/* ------------------------------------------------------------------ */
const buildRfpEmailBody = (
  rfpId: string,
  rfpTitle: string,
  rfpText: string
): string => {
  return `
Hello,

You are invited to submit a proposal for the following Request for Proposal (RFP).

==================================================
RFP-ID: ${rfpId}
==================================================

Title:
${rfpTitle}

Description:
${rfpText}

--------------------------------------------------
IMPORTANT:
• Please REPLY to this email with your proposal
• Do NOT remove the RFP-ID from your reply
• Keep all responses in the same email thread
--------------------------------------------------

Regards,
Procurement Team
`;
};

/* ------------------------------------------------------------------ */
/* SEND RFP EMAILS */
/* ------------------------------------------------------------------ */
export const sendRfpEmails = async (
  rfpId: string,
  vendorIds: string[]
): Promise<string[]> => {
  const rfp = await RfpModel.findById(rfpId);

  if (!rfp) {
    throw new Error("RFP not found");
  }

  if (rfp.status !== RfpStatus.DRAFT) {
    throw new Error("RFP has already been sent");
  }

  const vendors = await VendorModel.find({
    _id: { $in: vendorIds },
    isActive: true
  });

  if (!vendors.length) {
    throw new Error("No valid vendors found");
  }

  const sentEmails: string[] = [];

  for (const vendor of vendors) {
    /* SUBJECT — RFP-ID FIRST FOR RELIABILITY */
    const subject = `RFP-ID:${rfp._id} | ${rfp.title}`;

    /* BODY — RFP-ID PROMINENTLY EMBEDDED */
    const body = buildRfpEmailBody(
      rfp._id.toString(),
      rfp.title,
      rfp.rawText
    );

    const message = [
      `To: ${vendor.email}`,
      "Content-Type: text/plain; charset=utf-8",
      "MIME-Version: 1.0",
      `Subject: ${subject}`,
      "",
      body
    ].join("\n");

    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage
      }
    });

    sentEmails.push(vendor.email);
  }

  /* ---------------------------------------------------------------- */
  /* UPDATE RFP STATE */
  /* ---------------------------------------------------------------- */
  rfp.sentToEmails = sentEmails;
  rfp.sentAt = new Date();
  rfp.status = RfpStatus.SENT;
  await rfp.save();

  return sentEmails;
};
