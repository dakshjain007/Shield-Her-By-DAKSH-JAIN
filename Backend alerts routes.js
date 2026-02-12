const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const Event = require('../models/Event');
const User = require('../models/User');

// Trigger alert
router.post('/trigger', async (req, res) => {
  try {
    const { userId, threatScore, location, triggerEvents } = req.body;

    // Get user and guardians
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create alert
    const alert = new Alert({
      userId,
      threatScore,
      location,
      triggerEvents: triggerEvents || [],
      notifications: {
        guardians: user.guardians.map(g => ({
          name: g.name,
          phone: g.phone,
          notifiedAt: new Date(),
          method: 'sms',
          delivered: true // Simulated
        })),
        emergencyServices: {
          notified: threatScore >= 75,
          notifiedAt: threatScore >= 75 ? new Date() : null,
          incidentId: threatScore >= 75 ? `INC-${Date.now()}` : null
        }
      },
      evidence: {
        recording: {
          started: true,
          startedAt: new Date(),
          url: `https://evidence.shieldher.com/${userId}/${Date.now()}.mp4`
        }
      },
      tracking: {
        active: true,
        shareUrl: `https://track.shieldher.com/${userId}`,
        updates: [{ ...location, timestamp: new Date() }]
      }
    });

    await alert.save();

    // Update events as processed
    if (triggerEvents && triggerEvents.length > 0) {
      await Event.updateMany(
        { _id: { $in: triggerEvents } },
        { $set: { alertTriggered: true } }
      );
    }

    res.json({
      alert,
      message: 'Alert triggered successfully',
      guardianCount: user.guardians.length,
      emergencyServicesNotified: threatScore >= 75
    });
  } catch (error) {
    console.error('Alert trigger error:', error);
    res.status(500).json({ error: 'Failed to trigger alert' });
  }
});

// Get alerts for user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, limit = 20 } = req.query;

    const query = { userId };
    if (status) query.status = status;

    const alerts = await Alert.find(query)
      .populate('triggerEvents')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Get single alert
router.get('/detail/:alertId', async (req, res) => {
  try {
    const { alertId } = req.params;
    
    const alert = await Alert.findById(alertId)
      .populate('triggerEvents')
      .populate('userId');

    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json({ alert });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alert' });
  }
});

// Update alert status
router.patch('/:alertId/status', async (req, res) => {
  try {
    const { alertId } = req.params;
    const { status, notes } = req.body;

    const alert = await Alert.findById(alertId);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    alert.status = status;
    
    if (status === 'resolved') {
      alert.resolvedAt = new Date();
      alert.response.userSafe = true;
      alert.response.confirmedAt = new Date();
    }
    
    if (notes) {
      alert.response.notes = notes;
    }

    await alert.save();

    res.json({ 
      alert,
      message: 'Alert status updated' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update alert' });
  }
});

// Add tracking update
router.post('/:alertId/tracking', async (req, res) => {
  try {
    const { alertId } = req.params;
    const { lat, lng } = req.body;

    const alert = await Alert.findById(alertId);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    alert.tracking.updates.push({
      lat,
      lng,
      timestamp: new Date()
    });

    await alert.save();

    res.json({ 
      message: 'Tracking updated',
      latestLocation: { lat, lng }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update tracking' });
  }
});

// Guardian arrived
router.post('/:alertId/guardian-arrived', async (req, res) => {
  try {
    const { alertId } = req.params;
    const { guardianId } = req.body;

    const alert = await Alert.findById(alertId);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    alert.response.guardianArrived = true;
    alert.response.guardianArrivedAt = new Date();
    alert.status = 'active';

    await alert.save();

    res.json({ 
      message: 'Guardian arrival confirmed',
      alert 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update alert' });
  }
});

// Get active alerts (for dashboard)
router.get('/active/all', async (req, res) => {
  try {
    const alerts = await Alert.find({
      status: { $in: ['triggered', 'active'] }
    })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ alerts, count: alerts.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active alerts' });
  }
});

module.exports = router;