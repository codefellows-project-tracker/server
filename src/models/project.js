const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  hostedUrl: {
    type: String,
    required: false,
    unique: true,
  },
  githubUrl: {
    type: String,
    required: false,
    unique: true,
  },
  image: {
    type: String,
    required: false,
    unique: true,
  },
  tech: [{ type: String }],
  description: {
    type: String,
    required: true,
  },
  classType: {
    type: String,
    required: true,
    enum: [
      '201',
      '301',
      'Javascript 401',
      'Python 401',
      'iOS 401',
    ],
  },
  classNumber: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Project', ProjectSchema);
