const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const aiEngine = require('../services/aiEngine');

// Simulate event detection
router.post('/simulate', async (req, res) => {
  try {
    const { userId, type, category, location, sensorData } = req.body;

    // Determine severity
    const criticalEvents = ['fall', 'snatch', 'help', 'scream'];
    const highEvents = ['struggle', 'unsafe-zone', 'silence'];
    const mediumEvents = ['running', 'deviation', 'night-travel', 'breathing'];
    
    let severity = 'low';
    if (criticalEvents.includes(type)) severity = 'critical';
    else if (highEvents.includes(type)) severity = 'high';
    else if (mediumEvents.includes(type)) severity = 'medium';

    // Get risk score from AI
    const recentEvents = await Event.find({ userId })
      .sort({ timestamp: -1 })
      .limit(10);

    const riskScore = aiEngine.calculateThreatScore(
      [...recentEvents, { type }],
      location,
      new Date(),
      {}
    );

    // Create event
    const event = new Event({
      userId,
      type,
      category,
      severity,
      riskScore,
      data: {
        location,
        sensorData,
        metadata: {
          simulated: true,
          timestamp: new Date()
        }
      }
    });

    await event.save();

    // Get AI analysis
    const analysis = aiEngine.analyzeThreatPattern([...recentEvents, event]);
    const reasoning = aiEngine.generateReasoning(
      riskScore,
      [...recentEvents, event],
      location,
      new Date()
    );

    res.json({
      event,
      threatScore: riskScore,
      analysis,
      reasoning,
      message: 'Event simulated successfully'
    });
  } catch (error) {
    console.error('Event simulation error:', error);
    res.status(500).json({ error: 'Event simulation failed' });
  }
});

// Get event history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    const events = await Event.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Event.countDocuments({ userId });

    res.json({
      events,
      total,
      limit,
      skip,
      hasMore: skip + events.length < total
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get events by type
router.get('/by-type/:userId/:type', async (req, res) => {
  try {
    const { userId, type } = req.params;
    
    const events = await Event.find({ userId, type })
      .sort({ timestamp: -1 })
      .limit(20);

    res.json({ events });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get event statistics
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const stats = await Event.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgRisk: { $avg: '$riskScore' },
          maxRisk: { $max: '$riskScore' }
        }
      }
    ]);

    const totalEvents = await Event.countDocuments({ userId });
    const criticalEvents = await Event.countDocuments({ 
      userId, 
      severity: 'critical' 
    });

    res.json({
      stats,
      totalEvents,
      criticalEvents,
      categoryBreakdown: stats
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Delete event
router.delete('/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    await Event.findByIdAndDelete(eventId);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;