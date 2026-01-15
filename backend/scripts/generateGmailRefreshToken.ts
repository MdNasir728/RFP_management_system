import { google } from "googleapis";
import express from "express";
import open from "open";
import { env } from "../src/config/env";

const CLIENT_ID = env.GMAIL_CLIENT_ID!;
const CLIENT_SECRET = env.GMAIL_CLIENT_SECRET!;
const REDIRECT_URI = "http://localhost:8080/oauth2callback";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send"
];

const app = express();

app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code as string;

  if (!code) {
    res.send("❌ No code received");
    return;
  }

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log("✅ REFRESH TOKEN:");
    console.log(tokens.refresh_token);

    res.send(
      "<h2>Authorization successful. Check your terminal.</h2>"
    );
    process.exit(0);
  } catch (err) {
    console.error(err);
    res.send("❌ Error retrieving tokens");
  }
});

app.listen(8080, () => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent"
  });

  console.log("Opening browser for authorization...");
  open(authUrl);
});
