// server/youtubeAuth.js
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Path to the saved token file
const TOKEN_PATH = path.join(__dirname, "token.json");

// 🔐 Load OAuth2 client credentials from .env
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// 🔑 Load and set the saved access + refresh token
try {
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
  oauth2Client.setCredentials(token);
} catch (error) {
  console.error("❌ Token file missing or invalid. Run getToken.js first to authorize.");
  process.exit(1);
}

// ✅ Authenticated YouTube client
const youtube = google.youtube({
  version: "v3",
  auth: oauth2Client,
});

module.exports = youtube;
