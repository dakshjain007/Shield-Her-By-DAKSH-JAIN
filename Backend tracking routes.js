const express = require('express');
const router = express.Router();

// Tracking Routes
const Tracking = require('mongoose').model('Tracking', new require('mongoose').Schema({
  userId: { type: require('mongoose').Schema.Types.ObjectId, ref: 'User' },
  locations: [{
    lat: Number,
    lng: Number,
    timestamp: Date,
    accuracy: Number
  }],
  createdAt: { type: Date, default: Date.now }
}));

// Update location
router.post('/update', async (req, res) => {
  try {
    const { userId, lat, lng, accuracy } = req.body;

    let tracking = await Tracking.findOne({ userId });
    
    if (!tracking) {
      tracking = new Tracking({ userId, locations: [] });
    }

    tracking.locations.push({
      lat,
      lng,
      accuracy: accuracy || 10,
      timestamp: new Date()
    });

    // Keep only last 100 locations
    if (tracking.locations.length > 100) {
      tracking.locations = tracking.locations.slice(-100);
    }

    await tracking.save();

    res.json({ 
      message: 'Location updated',
      location: { lat, lng }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update location' });
  }
});

// Get location history
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const tracking = await Tracking.findOne({ userId });
    
    if (!tracking) {
      return res.json({ locations: [] });
    }

    const locations = tracking.locations
      .slice(-limit)
      .reverse();

    res.json({ locations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tracking' });
  }
});

module.exports = router;