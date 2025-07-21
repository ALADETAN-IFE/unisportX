const fs = require("fs");
require("dotenv").config(); // Load .env

const backendURL = process.env.VITE_SERVER_URL;

const vercelConfig = {
  rewrites: [
    {
      source: "/sitemap.xml",
      destination: `${backendURL}/sitemap.xml`
    }
  ]
};

fs.writeFileSync("vercel.json", JSON.stringify(vercelConfig, null, 2));