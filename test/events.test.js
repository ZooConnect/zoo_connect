// test/events.test.js
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

// Mock the getDB function
vi.mock('../src/db.js', () => ({
  getDB: vi.fn()
}));

import { getDB } from '../src/db.js';

describe('GET /api/events', () => {
  let mockCollection;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock collection with chainable methods
    mockCollection = {
      find: vi.fn(() => mockCollection),
      sort: vi.fn(() => mockCollection),
      toArray: vi.fn()
    };
    
    // Mock getDB to return our mock collection
    getDB.mockResolvedValue({
      collection: vi.fn(() => mockCollection)
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Success Cases', () => {
    it('should return all active upcoming events', async () => {
      const mockEvents = [
        {
          _id: '1',
          title: 'Lion Feeding',
          description: 'Watch our lions enjoy their meal',
          start_date: new Date('2025-12-20T10:00:00Z'),
          end_date: new Date('2025-12-20T11:00:00Z'),
          type: 'feeding',
          status: 'active'
        },
        {
          _id: '2',
          title: 'Elephant Show',
          description: 'Amazing elephant performance',
          start_date: new Date('2025-12-21T14:00:00Z'),
          end_date: new Date('2025-12-21T15:00:00Z'),
          type: 'show',
          status: 'active'
        }
      ];

      mockCollection.toArray.mockResolvedValue(mockEvents);

      const response = await request(app)
        .get('/api/events')
        .expect(200);

      // Dates are serialized to ISO strings in JSON
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Lion Feeding');
      expect(response.body[0].type).toBe('feeding');
      expect(response.body[1].title).toBe('Elephant Show');
      expect(response.body[1].type).toBe('show');
    });

    it('should return empty array when no events exist', async () => {
      mockCollection.toArray.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body).toEqual([]);
      expect(response.body).toHaveLength(0);
    });

    it('should filter events by specific date', async () => {
      const mockEvents = [
        {
          _id: '1',
          title: 'Morning Tour',
          description: 'Guided morning tour',
          start_date: new Date('2025-12-20T09:00:00Z'),
          end_date: new Date('2025-12-20T11:00:00Z'),
          type: 'tour',
          status: 'active'
        }
      ];

      mockCollection.toArray.mockResolvedValue(mockEvents);

      const response = await request(app)
        .get('/api/events?date=2025-12-20')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Morning Tour');
      expect(response.body[0].type).toBe('tour');
    });

    it('should filter events by type', async () => {
      const mockEvents = [
        {
          _id: '1',
          title: 'Penguin Feeding',
          description: 'Feed the penguins',
          start_date: new Date('2025-12-20T10:00:00Z'),
          end_date: new Date('2025-12-20T10:30:00Z'),
          type: 'feeding',
          status: 'active'
        }
      ];

      mockCollection.toArray.mockResolvedValue(mockEvents);

      const response = await request(app)
        .get('/api/events?type=feeding')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Penguin Feeding');
      expect(response.body[0].type).toBe('feeding');
    });

    it('should filter events by both date and type', async () => {
      const mockEvents = [
        {
          _id: '1',
          title: 'Conservation Workshop',
          description: 'Learn about wildlife conservation',
          start_date: new Date('2025-12-25T13:00:00Z'),
          end_date: new Date('2025-12-25T15:00:00Z'),
          type: 'workshop',
          status: 'active'
        }
      ];

      mockCollection.toArray.mockResolvedValue(mockEvents);

      const response = await request(app)
        .get('/api/events?date=2025-12-25&type=workshop')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Conservation Workshop');
      expect(response.body[0].type).toBe('workshop');
    });

    it('should return events sorted by start_date ascending', async () => {
      const mockEvents = [
        {
          _id: '1',
          title: 'Early Event',
          start_date: new Date('2025-12-20T08:00:00Z'),
          end_date: new Date('2025-12-20T09:00:00Z'),
          type: 'tour',
          status: 'active'
        },
        {
          _id: '2',
          title: 'Later Event',
          start_date: new Date('2025-12-22T14:00:00Z'),
          end_date: new Date('2025-12-22T15:00:00Z'),
          type: 'show',
          status: 'active'
        }
      ];

      mockCollection.toArray.mockResolvedValue(mockEvents);

      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body[0].title).toBe('Early Event');
      expect(response.body[1].title).toBe('Later Event');
    });
  });

  describe('Validation and Error Cases', () => {
    it('should return 400 for invalid date format', async () => {
      const response = await request(app)
        .get('/api/events?date=20-12-2025')
        .expect(400);

      expect(response.body).toHaveProperty('error', true);
      expect(response.body.message).toContain('Invalid date format');
    });

    it('should return 400 for invalid date value', async () => {
      const response = await request(app)
        .get('/api/events?date=2025-13-45')
        .expect(400);

      expect(response.body).toHaveProperty('error', true);
      expect(response.body.message).toContain('Invalid date');
    });

    it('should return 400 for invalid event type', async () => {
      const response = await request(app)
        .get('/api/events?type=invalid-type')
        .expect(400);

      expect(response.body).toHaveProperty('error', true);
      expect(response.body.message).toContain('Invalid event type');
    });

    it('should handle database errors gracefully', async () => {
      mockCollection.toArray.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/api/events')
        .expect(500);

      expect(response.body).toHaveProperty('error', true);
      expect(response.body.message).toBe('Internal server error');
    });
  });

  describe('Event Type Cases', () => {
    const eventTypes = ['feeding', 'show', 'workshop', 'tour', 'special', 'conservation'];

    eventTypes.forEach(type => {
      it(`should accept valid event type: ${type}`, async () => {
        const mockEvents = [
          {
            _id: '1',
            title: `${type} event`,
            start_date: new Date('2025-12-20T10:00:00Z'),
            end_date: new Date('2025-12-20T11:00:00Z'),
            type: type,
            status: 'active'
          }
        ];

        mockCollection.toArray.mockResolvedValue(mockEvents);

        const response = await request(app)
          .get(`/api/events?type=${type}`)
          .expect(200);

        expect(response.body).toHaveLength(1);
        expect(response.body[0].type).toBe(type);
      });
    });

    it('should handle case-insensitive event types', async () => {
      const mockEvents = [
        {
          _id: '1',
          title: 'Workshop Event',
          start_date: new Date('2025-12-20T10:00:00Z'),
          end_date: new Date('2025-12-20T11:00:00Z'),
          type: 'workshop',
          status: 'active'
        }
      ];

      mockCollection.toArray.mockResolvedValue(mockEvents);

      const response = await request(app)
        .get('/api/events?type=WORKSHOP')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Workshop Event');
      expect(response.body[0].type).toBe('workshop');
    });
  });

  describe('Active and Status Filtering', () => {
    it('should only return active events', async () => {
      const mockEvents = [
        {
          _id: '1',
          title: 'Active Event',
          start_date: new Date('2025-12-20T10:00:00Z'),
          end_date: new Date('2025-12-20T11:00:00Z'),
          type: 'show',
          status: 'active'
        }
      ];

      mockCollection.toArray.mockResolvedValue(mockEvents);

      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body.every(event => event.status === 'active')).toBe(true);
    });

    it('should only return future and ongoing events', async () => {
      const now = new Date('2025-12-13T12:00:00Z');
      const mockEvents = [
        {
          _id: '1',
          title: 'Future Event',
          start_date: new Date('2025-12-20T10:00:00Z'),
          end_date: new Date('2025-12-20T11:00:00Z'),
          type: 'show',
          status: 'active'
        },
        {
          _id: '2',
          title: 'Ongoing Event',
          start_date: new Date('2025-12-13T10:00:00Z'),
          end_date: new Date('2025-12-13T14:00:00Z'),
          type: 'tour',
          status: 'active'
        }
      ];

      mockCollection.toArray.mockResolvedValue(mockEvents);

      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body.every(event => new Date(event.end_date) >= now)).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing query parameters gracefully', async () => {
      const mockEvents = [
        {
          _id: '1',
          title: 'Event',
          start_date: new Date('2025-12-20T10:00:00Z'),
          end_date: new Date('2025-12-20T11:00:00Z'),
          type: 'show',
          status: 'active'
        }
      ];

      mockCollection.toArray.mockResolvedValue(mockEvents);

      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Event');
      expect(response.body[0].status).toBe('active');
    });

    it('should handle events with minimal fields', async () => {
      const mockEvents = [
        {
          _id: '1',
          title: 'Minimal Event',
          start_date: new Date('2025-12-20T10:00:00Z'),
          end_date: new Date('2025-12-20T11:00:00Z'),
          status: 'active'
        }
      ];

      mockCollection.toArray.mockResolvedValue(mockEvents);

      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Minimal Event');
      expect(response.body[0].status).toBe('active');
    });

    it('should handle events with all optional fields', async () => {
      const mockEvents = [
        {
          _id: '1',
          title: 'Complete Event',
          description: 'Detailed description',
          start_date: new Date('2025-12-20T10:00:00Z'),
          end_date: new Date('2025-12-20T11:00:00Z'),
          type: 'special',
          status: 'active',
          location: 'Main Arena',
          capacity: 100
        }
      ];

      mockCollection.toArray.mockResolvedValue(mockEvents);

      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Complete Event');
      expect(response.body[0].type).toBe('special');
      expect(response.body[0].location).toBe('Main Arena');
      expect(response.body[0].capacity).toBe(100);
    });
  });
});
