const User = require('../models/User');
const Video = require('../models/Video');

exports.allUser = async (req, res) => {
    try {
      // const users = await User.find()
      const users = await User.find(
        {},
        {
          password: 0,
          resetPasswordExpires: 0,
          resetPasswordToken: 0,
          verificationToken: 0,
          verificationTokenExpires: 0,
        }
      ); // Exclude some field
      res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params
    if (!id){
      return res.status(400).json({ message: 'User ID is required' });
    }
    try{
        const user = await User.findByIdAndDelete(id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: `User ${user.username || user.email} deleted successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Toggle user active status
exports.toggleUserStatus = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  if (!id) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  if (typeof isActive !== 'boolean') {
    return res.status(400).json({ message: 'isActive boolean is required' });
  }
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true, select: '-password -resetPasswordExpires -resetPasswordToken -verificationToken -verificationTokenExpires' }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: `User status updated to ${isActive ? 'active' : 'inactive'}`, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Delete a video by ID
exports.deleteVideo = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Video ID is required' });
  }
  try {
    const video = await Video.findByIdAndDelete(id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.status(200).json({ message: `Video '${video.title}' deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};