import { google } from "googleapis";
import http from "http";
import open from "open";

const CLIENT_ID = '87115998605-e6he2ag4bueg2o4rqcuna291r9ito2jd.apps.googleusercontent.com';
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:8080/oauth2callback";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

async function main() {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent"
  });

  console.log("Opening browser for authentication...");
  await open(authUrl);

  const server = http
    .createServer(async (req, res) => {
      if (!req.url) return;

      const url = new URL(req.url, REDIRECT_URI);
      const code = url.searchParams.get("code");

      if (!code) {
        res.end("No code found");
        return;
      }

      const { tokens } = await oAuth2Client.getToken(code);

      console.log("\n✅ REFRESH TOKEN (SAVE THIS):\n");
      console.log(tokens.refresh_token);

      res.end("Authentication successful! You can close this tab.");
      server.close();
    })
    .listen(8080);
}

main().catch(console.error);
