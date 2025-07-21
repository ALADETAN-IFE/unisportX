const fs = require("fs");
const youtube = require("../config/youtubeAuth"); // Adjust path if needed
const Video = require("../models/Video");
const User = require('../models/User');

exports.uploadVideo = async (req, res) => {
  try {
    const filePath = req.file.path;
    const {
      title,
      country,
      schoolName,
      schoolDepartment,
      schoolFaculty,
      schoolCampus,
      eventType,
      participants,
      tags,
      description
    } = req.body;
    const userId = req.user.id;
    const year = new Date().getFullYear();

    // Validate required fields
    if (!title || !country || !schoolName || !description || !filePath) {
      return res.status(400).json({
        error:
          !title ? "Please provide a title"
            : !country ? "Please provide a country"
            : !schoolName ? "Please provide the school name"
            : !filePath ? "Please provide the video file"
            : !description ? "Please provide a description" : "Missing required fields"
      });
    }
    const existingUser = await User.findById(userId);

    // Playlist logic (can use schoolName or faculty for playlist)
    const playlistName = `${schoolName || schoolFaculty}(${year})`;

    // STEP 1: Check if playlist exists
    const playlists = await youtube.playlists.list({
      part: "snippet",
      mine: true,
      maxResults: 50,
    });

    let playlistId;
    const existing = playlists.data.items.find(
      (p) => p.snippet.title === playlistName
    );

    // STEP 2: Create if not exists
    if (!existing) {
      const newPlaylist = await youtube.playlists.insert({
        part: "snippet,status",
        requestBody: {
          snippet: {
            title: playlistName,
            description: `Playlist for ${schoolFaculty || schoolName} (${year})`,
          },
          status: {
            privacyStatus: "unlisted",
          },
        },
      });
      playlistId = newPlaylist.data.id;
    } else {
      playlistId = existing.id;
    }

    // STEP 3: Upload the video
    const response = await youtube.videos.insert({
      part: "snippet,status",
      requestBody: {
        snippet: {
          title,
          description: description || `School: ${schoolName}`,
          tags: [
            "UnisportX",
            "sportsweek",
            "university",
            schoolFaculty,
            year,
            schoolName,
            ...(Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []))
          ],
        },
        status: {
          privacyStatus: "unlisted",
        },
      },
      media: {
        body: fs.createReadStream(filePath),
      },
    });

    const videoId = response.data.id;

    // STEP 4: Add video to playlist
    await youtube.playlistItems.insert({
      part: "snippet",
      requestBody: {
        snippet: {
          playlistId,
          resourceId: {
            kind: "youtube#video",
            videoId,
          },
        },
      },
    });

    // Clean up local file
    fs.unlinkSync(filePath);

    // Prepare participants array if provided
    let participantsArr = [];
    if (participants) {
      try {
        participantsArr = typeof participants === 'string' ? JSON.parse(participants) : participants;
      } catch (e) {
        participantsArr = [];
      }
    }

    // Save to DB
    const video = await Video.create({
      title,
      country,
      school: {
        name: schoolName,
        department: schoolDepartment,
        faculty: schoolFaculty,
        campus: schoolCampus
      },
      eventType: eventType || 'General',
      participants: participantsArr,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      youtubeLink: `https://www.youtube.com/watch?v=${videoId}`,
      description,
      uploadedBy: existingUser._id
    });

    res.json({ success: true, video, res: response });
  } catch (err) {
    console.error('Video upload error:', err);
    
    // Clean up local file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupErr) {
        console.error('Error cleaning up file:', cleanupErr);
      }
    }

    // Handle specific YouTube API errors
    if (err.code === 404 && err.message === 'Channel not found.') {
      return res.status(400).json({
        success: false,
        error: "YouTube channel not found",
        message: "The YouTube channel associated with this account could not be found. Please ensure the YouTube account is properly set up and has a channel created."
      });
    }

    if (err.code === 401 || err.code === 403) {
      return res.status(400).json({
        success: false,
        error: "YouTube authentication failed",
        message: "YouTube API authentication has expired or is invalid. Please contact the administrator to refresh the YouTube integration."
      });
    }

    if (err.code === 400) {
      return res.status(400).json({
        success: false,
        error: "YouTube API error",
        message: "There was an issue with the YouTube API. Please try again or contact support."
      });
    }

    res.status(500).json({ 
      success: false, 
      error: "Upload failed", 
      message: "An unexpected error occurred during video upload. Please try again."
    });
  }
};

exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ uploadTime: -1 });
    if (!videos || videos.length === 0) {
      return res.status(404).json({ message: 'No videos found', videos: [] });
    }
    res.status(200).json({videos});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
}; 

exports.getOneVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.status(200).json(video);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Something went wrong' });
  }
}