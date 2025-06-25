const fs = require("fs");
const youtube = require("../config/youtubeAuth"); // Adjust path if needed
const Video = require("../models/Video");

exports.uploadVideo = async (req, res) => {
  try {
    const filePath = req.file.path;
    const { title, faculty, description } = req.body;
    const  year = new Date().getFullYear();
         if( !title || !faculty || !description || !filePath ){

           return res.status(400).json(
             { error: 
                !title ? "Please provide a title"
                 : !faculty ? "Please provide the faculty name" 
                 : !filePath ? "Please provide the video file" 
                 : !description ? "Please provide a description" : "Missing required fields" }
           )
         }

    const playlistName = `${faculty}(${year})`;

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
            description: `Playlist for ${faculty} (${year})`,
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
          description: description || `Faculty: ${faculty}`,
          tags: ["UnisportX", "sportsweek", "university", faculty, year],
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

    // Save to DB
    const video = await Video.create({
      title,
      youtubeLink: `https://www.youtube.com/watch?v=${videoId}`,
      faculty,
      description
    });

    res.json({ success: true, video, res: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Upload failed", msg: err });
  }
};


exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ uploadTime: -1 });
    if (!videos || videos.length === 0) {
      return res.status(404).json({ message: 'No videos found' });
    }
    res.status(200).json(videos);
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