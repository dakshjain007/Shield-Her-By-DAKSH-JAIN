const aiEngine = require('../services/aiEngine');

module.exports = (io) => {
  const userSockets = new Map();
  const guardianSockets = new Map();

  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    // User joins their room
    socket.on('join:user', ({ userId }) => {
      socket.join(`user:${userId}`);
      userSockets.set(userId, socket.id);
      console.log(`👤 User ${userId} joined`);
      
      socket.emit('connection:confirmed', {
        userId,
        timestamp: new Date().toISOString()
      });
    });

    // Guardian joins their room
    socket.on('join:guardian', ({ guardianId, userId }) => {
      socket.join(`guardian:${guardianId}`);
      socket.join(`monitoring:${userId}`);
      guardianSockets.set(guardianId, socket.id);
      console.log(`🛡️ Guardian ${guardianId} monitoring user ${userId}`);
    });

    // Location update
    socket.on('location:update', async ({ userId, lat, lng, timestamp }) => {
      try {
        // Broadcast to guardians monitoring this user
        io.to(`monitoring:${userId}`).emit('location:updated', {
          userId,
          location: { lat, lng },
          timestamp: timestamp || new Date().toISOString()
        });

        // Check for location-based risks
        const locationRisk = aiEngine.getLocationRisk({ lat, lng });
        if (locationRisk > 15) {
          socket.emit('alert:location-risk', {
            risk: locationRisk,
            message: 'Entering high-risk zone'
          });
        }
      } catch (error) {
        console.error('Location update error:', error);
      }
    });

    // Event detected
    socket.on('event:detected', async ({ userId, eventType, data }) => {
      try {
        console.log(`📡 Event detected: ${eventType} for user ${userId}`);
        
        // Calculate new threat score
        const events = data.recentEvents || [];
        const location = data.location || {};
        const time = new Date();
        const behavior = data.behavior || {};
        
        const threatScore = aiEngine.calculateThreatScore(
          events,
          location,
          time,
          behavior
        );

        // Get threat level
        let threatLevel = 'safe';
        if (threatScore >= 75) threatLevel = 'critical';
        else if (threatScore >= 50) threatLevel = 'danger';
        else if (threatScore >= 30) threatLevel = 'caution';

        // Emit threat update to user
        socket.emit('threat:updated', {
          score: threatScore,
          level: threatLevel,
          event: eventType,
          timestamp: new Date().toISOString()
        });

        // Emit to monitoring guardians
        io.to(`monitoring:${userId}`).emit('threat:detected', {
          userId,
          score: threatScore,
          level: threatLevel,
          event: eventType,
          location: location,
          timestamp: new Date().toISOString()
        });

        // Generate AI reasoning
        const reasoning = aiEngine.generateReasoning(
          threatScore,
          events,
          location,
          time
        );

        socket.emit('ai:reasoning', {
          reasoning,
          analysis: aiEngine.analyzeThreatPattern(events)
        });

        // Auto-trigger alert if threshold exceeded
        if (threatScore >= 60) {
          const alertData = {
            userId,
            threatScore,
            location,
            triggerEvent: eventType,
            timestamp: new Date().toISOString()
          };

          socket.emit('alert:triggered', alertData);
          io.to(`monitoring:${userId}`).emit('guardian:alert', alertData);

          // Simulate emergency actions
          setTimeout(() => {
            socket.emit('emergency:guardian-notified', {
              method: 'SMS',
              status: 'sent',
              timestamp: new Date().toISOString()
            });
          }, 1000);

          setTimeout(() => {
            socket.emit('emergency:services-notified', {
              status: 'dispatched',
              eta: '8 minutes',
              timestamp: new Date().toISOString()
            });
          }, 2000);

          setTimeout(() => {
            socket.emit('emergency:recording-started', {
              status: 'active',
              uploading: true,
              timestamp: new Date().toISOString()
            });
          }, 1500);
        }
      } catch (error) {
        console.error('Event detection error:', error);
        socket.emit('error', { message: 'Event processing failed' });
      }
    });

    // Manual alert trigger
    socket.on('alert:manual', ({ userId, location }) => {
      console.log(`🚨 Manual alert triggered by user ${userId}`);
      
      const alertData = {
        userId,
        threatScore: 100,
        location,
        manual: true,
        timestamp: new Date().toISOString()
      };

      socket.emit('alert:confirmed', alertData);
      io.to(`monitoring:${userId}`).emit('guardian:emergency', alertData);
    });

    // Guardian response
    socket.on('guardian:respond', ({ guardianId, userId, action }) => {
      console.log(`🛡️ Guardian ${guardianId} responding: ${action}`);
      
      io.to(`user:${userId}`).emit('guardian:response', {
        guardianId,
        action,
        timestamp: new Date().toISOString()
      });
    });

    // Safe confirmation
    socket.on('user:safe', ({ userId }) => {
      console.log(`✅ User ${userId} confirmed safe`);
      
      socket.emit('alert:resolved', {
        userId,
        status: 'safe',
        timestamp: new Date().toISOString()
      });

      io.to(`monitoring:${userId}`).emit('alert:resolved', {
        userId,
        status: 'safe',
        timestamp: new Date().toISOString()
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id);
      
      // Clean up socket references
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
        }
      }
      
      for (const [guardianId, socketId] of guardianSockets.entries()) {
        if (socketId === socket.id) {
          guardianSockets.delete(guardianId);
        }
      }
    });
  });

  // Periodic health check
  setInterval(() => {
    io.emit('health:ping', { timestamp: new Date().toISOString() });
  }, 30000);

  return io;
};