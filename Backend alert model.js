const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  threatScore: {
    type: Number,
    required: true
  },
  triggerEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: String
  },
  status: {
    type: String,
    enum: ['triggered', 'active', 'resolved', 'false-alarm'],
    default: 'triggered'
  },
  notifications: {
    guardians: [{
      guardianId: String,
      name: String,
      phone: String,
      notifiedAt: Date,
      method: { type: String, enum: ['sms', 'call', 'email'] },
      delivered: Boolean
    }],
    emergencyServices: {
      notified: Boolean,
      notifiedAt: Date,
      incidentId: String
    }
  },
  evidence: {
    recording: {
      started: Boolean,
      startedAt: Date,
      url: String
    },
    photos: [String],
    audioClips: [String],
    sensorLogs: String
  },
  tracking: {
    active: Boolean,
    shareUrl: String,
    updates: [{
      lat: Number,
      lng: Number,
      timestamp: Date
    }]
  },
  response: {
    userSafe: Boolean,
    confirmedAt: Date,
    guardianArrived: Boolean,
    guardianArrivedAt: Date,
    policeInvolved: Boolean,
    notes: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: Date
}, {
  timestamps: true
});

// Index for queries
alertSchema.index({ userId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);