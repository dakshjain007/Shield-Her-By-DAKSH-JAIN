const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Alert = require('../models/Alert');

// Get danger zone heatmap data
router.get('/heatmap', async (req, res) => {
  try {
    const { timeRange = '7d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    const daysAgo = timeRange === '30d' ? 30 : timeRange === '7d' ? 7 : 1;
    const startDate = new Date(now - daysAgo * 24 * 60 * 60 * 1000);

    // Get events with location data
    const events = await Event.find({
      timestamp: { $gte: startDate },
      'data.location.lat': { $exists: true }
    }).select('data.location severity type');

    // Process into heatmap points
    const heatmapData = events.map(event => ({
      lat: event.data.location.lat,
      lng: event.data.location.lng,
      weight: event.severity === 'critical' ? 4 : 
              event.severity === 'high' ? 3 : 
              event.severity === 'medium' ? 2 : 1,
      type: event.type
    }));

    // Cluster nearby points
    const clusters = clusterPoints(heatmapData, 0.01); // ~1km radius

    res.json({
      heatmap: heatmapData,
      clusters,
      total: events.length,
      timeRange
    });
  } catch (error) {
    console.error('Heatmap error:', error);
    res.status(500).json({ error: 'Failed to generate heatmap' });
  }
});

// Get risk trends over time
router.get('/trends', async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    
    const now = new Date();
    const days = period === 'month' ? 30 : period === 'week' ? 7 : 1;
    const startDate = new Date(now - days * 24 * 60 * 60 * 1000);

    // Aggregate events by day
    const trends = await Event.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            severity: '$severity'
          },
          count: { $sum: 1 },
          avgRisk: { $avg: '$riskScore' }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);

    // Format for charts
    const chartData = formatTrendsForChart(trends);

    res.json({
      trends: chartData,
      period,
      totalEvents: trends.reduce((sum, t) => sum + t.count, 0)
    });
  } catch (error) {
    console.error('Trends error:', error);
    res.status(500).json({ error: 'Failed to generate trends' });
  }
});

// Get time-of-day risk analysis
router.get('/time-analysis', async (req, res) => {
  try {
    const events = await Event.find({
      timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }).select('timestamp severity riskScore');

    // Group by hour
    const hourlyData = Array(24).fill(0).map((_, hour) => ({
      hour,
      count: 0,
      avgRisk: 0,
      critical: 0
    }));

    events.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      hourlyData[hour].count++;
      hourlyData[hour].avgRisk += event.riskScore;
      if (event.severity === 'critical') hourlyData[hour].critical++;
    });

    // Calculate averages
    hourlyData.forEach(data => {
      if (data.count > 0) {
        data.avgRisk = Math.round(data.avgRisk / data.count);
      }
    });

    res.json({ hourlyData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze time data' });
  }
});

// Get event type distribution
router.get('/distribution', async (req, res) => {
  try {
    const distribution = await Event.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgRisk: { $avg: '$riskScore' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const categoryDistribution = await Event.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      byType: distribution,
      byCategory: categoryDistribution
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get distribution' });
  }
});

// Get alert statistics
router.get('/alert-stats', async (req, res) => {
  try {
    const totalAlerts = await Alert.countDocuments();
    const activeAlerts = await Alert.countDocuments({ 
      status: { $in: ['triggered', 'active'] }
    });
    const resolvedAlerts = await Alert.countDocuments({ status: 'resolved' });
    const falseAlarms = await Alert.countDocuments({ status: 'false-alarm' });

    // Average response time (simulated)
    const avgResponseTime = 120; // 2 minutes in seconds

    // Guardian notification success rate
    const successRate = 98;

    res.json({
      totalAlerts,
      activeAlerts,
      resolvedAlerts,
      falseAlarms,
      avgResponseTime,
      guardianNotificationRate: successRate
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get alert stats' });
  }
});

// Helper functions
function clusterPoints(points, radiusKm) {
  const clusters = [];
  const processed = new Set();

  points.forEach((point, i) => {
    if (processed.has(i)) return;

    const cluster = {
      lat: point.lat,
      lng: point.lng,
      count: 1,
      totalWeight: point.weight,
      points: [point]
    };

    points.forEach((otherPoint, j) => {
      if (i === j || processed.has(j)) return;

      const dist = calculateDistance(
        point.lat, point.lng,
        otherPoint.lat, otherPoint.lng
      );

      if (dist <= radiusKm) {
        cluster.count++;
        cluster.totalWeight += otherPoint.weight;
        cluster.points.push(otherPoint);
        cluster.lat = (cluster.lat + otherPoint.lat) / 2;
        cluster.lng = (cluster.lng + otherPoint.lng) / 2;
        processed.add(j);
      }
    });

    clusters.push(cluster);
    processed.add(i);
  });

  return clusters;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

function formatTrendsForChart(trends) {
  const dateMap = new Map();

  trends.forEach(item => {
    const date = item._id.date;
    if (!dateMap.has(date)) {
      dateMap.set(date, {
        date,
        total: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        avgRisk: 0
      });
    }

    const data = dateMap.get(date);
    data.total += item.count;
    data[item._id.severity] = item.count;
    data.avgRisk += item.avgRisk * item.count;
  });

  return Array.from(dateMap.values()).map(data => ({
    ...data,
    avgRisk: Math.round(data.avgRisk / data.total)
  }));
}

module.exports = router;