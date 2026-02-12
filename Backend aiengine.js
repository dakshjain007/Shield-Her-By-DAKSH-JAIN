// AI Simulation Engine - Rule-based ML simulation for threat prediction

class AIEngine {
  constructor() {
    this.baseRiskScore = 20;
    this.eventWeights = {
      // Voice events
      scream: 25,
      help: 30,
      breathing: 15,
      silence: 20,
      
      // Motion events
      fall: 35,
      snatch: 40,
      running: 20,
      struggle: 30,
      
      // Behavior events
      deviation: 15,
      'unsafe-zone': 25,
      'unusual-stop': 12,
      'night-travel': 18
    };
    
    this.locationRiskZones = [
      { lat: 28.6139, lng: 77.2090, radius: 2, risk: 15, name: 'High Crime Area' },
      { lat: 28.7041, lng: 77.1025, radius: 1.5, risk: 20, name: 'Unsafe Zone' }
    ];
  }

  calculateThreatScore(events, location, time, userBehavior) {
    let score = this.baseRiskScore;
    
    // Event-based risk
    events.forEach(event => {
      score += this.eventWeights[event.type] || 10;
    });
    
    // Location-based risk
    const locationRisk = this.getLocationRisk(location);
    score += locationRisk;
    
    // Time-based risk
    const timeRisk = this.getTimeRisk(time);
    score += timeRisk;
    
    // Behavior pattern risk
    const behaviorRisk = this.getBehaviorRisk(userBehavior);
    score += behaviorRisk;
    
    // Cap at 100
    return Math.min(100, Math.round(score));
  }

  getLocationRisk(location) {
    if (!location || !location.lat || !location.lng) return 0;
    
    for (const zone of this.locationRiskZones) {
      const distance = this.calculateDistance(
        location.lat, location.lng,
        zone.lat, zone.lng
      );
      
      if (distance <= zone.radius) {
        return zone.risk;
      }
    }
    
    return 0;
  }

  getTimeRisk(time = new Date()) {
    const hour = time.getHours();
    
    // High risk: 22:00 - 05:00
    if (hour >= 22 || hour < 5) return 15;
    
    // Medium risk: 20:00 - 22:00, 05:00 - 07:00
    if ((hour >= 20 && hour < 22) || (hour >= 5 && hour < 7)) return 8;
    
    // Low risk: daytime
    return 0;
  }

  getBehaviorRisk(behavior) {
    if (!behavior) return 0;
    
    let risk = 0;
    
    // Route deviation
    if (behavior.routeDeviation) {
      risk += 12;
    }
    
    // Speed anomaly
    if (behavior.speedAnomaly) {
      risk += 10;
    }
    
    // Low crowd density
    if (behavior.crowdDensity === 'low') {
      risk += 8;
    }
    
    // Unusual stop duration
    if (behavior.unusualStop) {
      risk += 10;
    }
    
    return risk;
  }

  analyzeThreatPattern(events) {
    if (!events || events.length === 0) {
      return {
        pattern: 'normal',
        confidence: 0.9,
        recommendation: 'Continue monitoring'
      };
    }
    
    const recentEvents = events.slice(-5);
    const criticalCount = recentEvents.filter(e => 
      ['fall', 'snatch', 'help', 'scream'].includes(e.type)
    ).length;
    
    if (criticalCount >= 2) {
      return {
        pattern: 'escalating-danger',
        confidence: 0.95,
        recommendation: 'Trigger emergency protocol immediately'
      };
    }
    
    const motionEvents = recentEvents.filter(e => 
      e.category === 'motion'
    ).length;
    
    if (motionEvents >= 3) {
      return {
        pattern: 'physical-struggle',
        confidence: 0.85,
        recommendation: 'Prepare emergency response'
      };
    }
    
    return {
      pattern: 'monitoring',
      confidence: 0.75,
      recommendation: 'Increase alert level'
    };
  }

  predictNextRisk(events, location) {
    const analysis = this.analyzeThreatPattern(events);
    const locationRisk = this.getLocationRisk(location);
    
    return {
      likelihood: this.calculateLikelihood(events, locationRisk),
      timeframe: this.estimateTimeframe(events),
      suggestedActions: this.getSuggestedActions(analysis, locationRisk),
      analysis
    };
  }

  calculateLikelihood(events, locationRisk) {
    const eventCount = events.length;
    const criticalEvents = events.filter(e => 
      e.severity === 'critical'
    ).length;
    
    let likelihood = 'low';
    
    if (criticalEvents >= 2 || locationRisk > 15) {
      likelihood = 'high';
    } else if (criticalEvents >= 1 || eventCount >= 3) {
      likelihood = 'medium';
    }
    
    return likelihood;
  }

  estimateTimeframe(events) {
    if (!events || events.length === 0) return 'none';
    
    const lastEvent = events[events.length - 1];
    const timeSinceEvent = Date.now() - new Date(lastEvent.timestamp).getTime();
    const minutesSince = timeSinceEvent / (1000 * 60);
    
    if (minutesSince < 2) return 'immediate';
    if (minutesSince < 10) return '5-10 minutes';
    return '10+ minutes';
  }

  getSuggestedActions(analysis, locationRisk) {
    const actions = [];
    
    if (analysis.pattern === 'escalating-danger') {
      actions.push('Trigger emergency alert');
      actions.push('Notify all guardians');
      actions.push('Start evidence recording');
      actions.push('Share live location');
    } else if (locationRisk > 15) {
      actions.push('Monitor closely');
      actions.push('Prepare guardians');
      actions.push('Track location');
    } else {
      actions.push('Continue monitoring');
      actions.push('Log events');
    }
    
    return actions;
  }

  generateReasoning(score, events, location, time) {
    const reasons = [];
    
    // Base risk
    reasons.push(`Base risk level: ${this.baseRiskScore}/100`);
    
    // Recent events
    if (events && events.length > 0) {
      const lastEvent = events[events.length - 1];
      reasons.push(`Last detected: ${this.getEventDescription(lastEvent.type)}`);
      reasons.push(`Events in last 10min: ${events.length}`);
    }
    
    // Location
    const locationRisk = this.getLocationRisk(location);
    if (locationRisk > 0) {
      reasons.push(`High-risk zone detected (+${locationRisk} risk)`);
    } else {
      reasons.push('Location: Safe zone');
    }
    
    // Time
    const timeRisk = this.getTimeRisk(time);
    if (timeRisk > 0) {
      reasons.push(`Time factor: Late hours (+${timeRisk} risk)`);
    }
    
    // Overall assessment
    if (score >= 75) {
      reasons.push('⚠️ CRITICAL: Multiple threat indicators detected');
    } else if (score >= 50) {
      reasons.push('⚠️ WARNING: Elevated risk level');
    } else if (score >= 30) {
      reasons.push('ℹ️ CAUTION: Minor anomalies detected');
    } else {
      reasons.push('✓ SAFE: Normal operation');
    }
    
    return reasons;
  }

  getEventDescription(type) {
    const descriptions = {
      scream: 'Scream detected',
      help: 'Distress keyword "HELP"',
      breathing: 'Panic breathing pattern',
      silence: 'Forced silence',
      fall: 'Sudden fall',
      snatch: 'Phone snatched',
      running: 'Running pattern',
      struggle: 'Struggle movements',
      deviation: 'Route deviation',
      'unsafe-zone': 'Unsafe zone entry',
      'unusual-stop': 'Unusual stop',
      'night-travel': 'Night travel'
    };
    
    return descriptions[type] || 'Unknown event';
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }
}

module.exports = new AIEngine();