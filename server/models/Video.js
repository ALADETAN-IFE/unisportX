const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },

  country: { type: String, required: true },

  school: {
    name: { type: String, required: true },
    department: { type: String },
    faculty: { type: String },
    campus: { type: String }
  },

  eventType: {
    type: String,
    // enum: ['Inter-University', 'Intra-University', 'Hostel Game', 'Training', 'General'],
    default: 'General',
  },

  participants: [
    {
      name: String,
      school: String,
      country: String,
    }
  ],

  tags: [String],

  youtubeLink: { type: String, required: true },

  description: { type: String, required: true },

  uploadTime: { type: Date, default: Date.now },

  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Video', videoSchema);

  // 'Arts',
  //     'Basic Medical Science',
  //     'Clinical Science',
  //     'Dental Science',
  //     'Education',
  //     'Engineering',
  //     'Environmental Science',
  //     'Health Professions',
  //     'Law',
  //     'Management Science',
  //     'Pharmacy',
  //     'Science',
  //     'Social Science'
