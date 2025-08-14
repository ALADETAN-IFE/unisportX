const express = require('express');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
require('dotenv').config();

// Note: If you want to add dynamic routes for posts/videos, you would need to import your models
const Post = require('../models/Post');
const Video = require('../models/Video');

const router = express.Router();

router.get('/sitemap.xml', async (req, res) => {
  try {
    const links = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/login', changefreq: 'monthly', priority: 0.5 },
      { url: '/signup', changefreq: 'monthly', priority: 0.5 },
      { url: '/app', changefreq: 'daily', priority: 0.9 },
      { url: '/app/videos', changefreq: 'daily', priority: 0.8 },
      { url: '/terms-and-conditions', changefreq: 'monthly', priority: 0.3 },
      { url: '/privacy-policy', changefreq: 'monthly', priority: 0.3 },
    ];

    
    // Example for dynamic posts (uncomment when needed):
    const posts = await Post.find({ isPublic: true }).limit(100);
    posts.forEach(post => {
      links.push({
        url: `/app/${post._id}`,
        changefreq: 'daily',
        priority: 0.7,
      });
    });

    // Example for dynamic videos (uncomment when needed):
    const videos = await Video.find().limit(100);
    videos.forEach(video => {
      links.push({
        url: `/app/video/${video._id}`,
        changefreq: 'daily',
        priority: 0.6,
      });
    });

    const stream = new SitemapStream({ 
      hostname: process.env.CLIENT_URL || 'http://localhost:3000' 
    });
    
    res.writeHead(200, {
      'Content-Type': 'application/xml',
    });

    const xml = await streamToPromise(Readable.from(links).pipe(stream));
    res.end(xml.toString());
  } catch (err) {
    console.error('Sitemap generation error:', err);
    res.status(500).end();
  }
});

module.exports = router;