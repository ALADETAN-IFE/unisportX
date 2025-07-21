export default async function handler(req, res) {
    const response = await fetch("https://unisportx.onrender.com/sitemap.xml");
    const xml = await response.text();
    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(xml);
  }