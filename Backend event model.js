const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'scream', 'help', 'breathing', 'silence',
      'fall', 'snatch', 'running', 'struggle',
      'deviation', 'unsafe-zone', 'unusual-stop', 'night-travel'
    ]
  },
  category: {
    type: String,
    enum: ['voice', 'motion', 'behavior'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  data: {
    location: {
      lat: Number,
      lng: Number,
      address: String
    },
    sensorData: mongoose.Schema.Types.Mixed,
    audioClip: String,
    videoClip: String,
    metadata: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  processed: {
    type: Boolean,
    default: false
  },
  alertTriggered: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for fast queries
eventSchema.index({ userId: 1, timestamp: -1 });
eventSchema.index({ type: 1, severity: 1 });

module.exports = mongoose.model('Event', eventSchema);