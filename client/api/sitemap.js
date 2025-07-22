//   const response = await fetch("https://unisportx.onrender.com/sitemap.xml");
export default async function handler(req, res) {
  const serverUrl = process.env.VITE_SERVER_URL;
  const response = await fetch(`${serverUrl}/sitemap.xml`);
  const xml = await response.text();
  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(xml);
}