// test/integration/eventsApi.test.js
import dotenv from 'dotenv';
dotenv.config();

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import Event from '../../src/models/event.model.js';
import { connectToDb } from '../../src/db/mongo.js';

describe('Events API (Integration Tests)', () => {
  // Connect to test database before all tests
  beforeAll(async () => {
    await connectToDb();
  });

  // Clean up database before each test
  beforeEach(async () => {
    await Event.deleteMany({});
  });

  // Close connection after all tests
  afterAll(async () => {
    await Event.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/events - Create Event', () => {
    it('should create a new event with valid data', async () => {
      const eventData = {
        title: 'Lion Feeding Time',
        description: 'Watch our lions enjoy their meal',
        start_date: '2025-12-20T10:00:00Z',
        end_date: '2025-12-20T11:00:00Z',
        type: 'feeding',
        status: 'active'
      };

      const res = await request(app)
        .post('/api/events')
        .send(eventData)
        .expect(201);

      expect(res.body).toHaveProperty('_id');
      expect(res.body.title).toBe(eventData.title);
      expect(res.body.description).toBe(eventData.description);
      expect(res.body.type).toBe(eventData.type);
      expect(res.body.status).toBe(eventData.status);
    });

    it('should create event without optional fields', async () => {
      const eventData = {
        title: 'Simple Event',
        start_date: '2025-12-20T10:00:00Z',
        end_date: '2025-12-20T11:00:00Z'
      };

      const res = await request(app)
        .post('/api/events')
        .send(eventData)
        .expect(201);

      expect(res.body).toHaveProperty('_id');
      expect(res.body.title).toBe(eventData.title);
      expect(res.body.status).toBe('active'); // Default value
    });

    it('should normalize event type to lowercase', async () => {
      const eventData = {
        title: 'Workshop Event',
        start_date: '2025-12-20T10:00:00Z',
        end_date: '2025-12-20T11:00:00Z',
        type: 'WORKSHOP'
      };

      const res = await request(app)
        .post('/api/events')
        .send(eventData)
        .expect(201);

      expect(res.body.type).toBe('workshop');
    });

    it('should reject event without title', async () => {
      const eventData = {
        start_date: '2025-12-20T10:00:00Z',
        end_date: '2025-12-20T11:00:00Z'
      };

      const res = await request(app)
        .post('/api/events')
        .send(eventData)
        .expect(400);

      expect(res.body.error).toBe(true);
      expect(res.body.message).toContain('Title is required');
    });

    it('should reject event without start_date', async () => {
      const eventData = {
        title: 'Test Event',
        end_date: '2025-12-20T11:00:00Z'
      };

      const res = await request(app)
        .post('/api/events')
        .send(eventData)
        .expect(400);

      expect(res.body.error).toBe(true);
      expect(res.body.message).toContain('start_date is required');
    });

    it('should reject event without end_date', async () => {
      const eventData = {
        title: 'Test Event',
        start_date: '2025-12-20T10:00:00Z'
      };

      const res = await request(app)
        .post('/api/events')
        .send(eventData)
        .expect(400);

      expect(res.body.error).toBe(true);
      expect(res.body.message).toContain('end_date is required');
    });

    it('should reject event with end_date before start_date', async () => {
      const eventData = {
        title: 'Invalid Event',
        start_date: '2025-12-20T11:00:00Z',
        end_date: '2025-12-20T10:00:00Z'
      };

      const res = await request(app)
        .post('/api/events')
        .send(eventData)
        .expect(400);

      expect(res.body.error).toBe(true);
      expect(res.body.message).toContain('end_date must be after start_date');
    });

    it('should reject event with invalid type', async () => {
      const eventData = {
        title: 'Test Event',
        start_date: '2025-12-20T10:00:00Z',
        end_date: '2025-12-20T11:00:00Z',
        type: 'invalid-type'
      };

      const res = await request(app)
        .post('/api/events')
        .send(eventData)
        .expect(400);

      expect(res.body.error).toBe(true);
    });
  });

  describe('GET /api/events - List Events', () => {
    beforeEach(async () => {
      // Create sample events
      await Event.create([
        {
          title: 'Past Event',
          start_date: new Date('2025-12-01T10:00:00Z'),
          end_date: new Date('2025-12-01T11:00:00Z'),
          type: 'feeding',
          status: 'active'
        },
        {
          title: 'Current Event',
          start_date: new Date('2025-12-13T10:00:00Z'),
          end_date: new Date('2025-12-25T11:00:00Z'),
          type: 'show',
          status: 'active'
        },
        {
          title: 'Future Event',
          start_date: new Date('2025-12-30T10:00:00Z'),
          end_date: new Date('2025-12-30T11:00:00Z'),
          type: 'workshop',
          status: 'active'
        },
        {
          title: 'Inactive Event',
          start_date: new Date('2025-12-28T10:00:00Z'),
          end_date: new Date('2025-12-28T11:00:00Z'),
          type: 'tour',
          status: 'inactive'
        }
      ]);
    });

    it('should return all active upcoming/ongoing events', async () => {
      const res = await request(app)
        .get('/api/events')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2); // Current and Future events
      expect(res.body.every(event => event.status === 'active')).toBe(true);
    });

    it('should filter events by type', async () => {
      const res = await request(app)
        .get('/api/events?type=workshop')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.every(event => event.type === 'workshop')).toBe(true);
    });

    it('should filter events by date', async () => {
      const res = await request(app)
        .get('/api/events?date=2025-12-30')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      // Should include events that overlap with 2025-12-30
    });

    it('should sort events by start_date ascending', async () => {
      const res = await request(app)
        .get('/api/events')
        .expect(200);

      expect(res.body.length).toBeGreaterThan(0);
      
      // Check if sorted
      for (let i = 1; i < res.body.length; i++) {
        const prev = new Date(res.body[i - 1].start_date);
        const curr = new Date(res.body[i].start_date);
        expect(curr >= prev).toBe(true);
      }
    });

    it('should return 400 for invalid date format', async () => {
      const res = await request(app)
        .get('/api/events?date=20-12-2025')
        .expect(400);

      expect(res.body.error).toBe(true);
      expect(res.body.message).toContain('Invalid date format');
    });

    it('should return 400 for invalid event type', async () => {
      const res = await request(app)
        .get('/api/events?type=invalid')
        .expect(400);

      expect(res.body.error).toBe(true);
      expect(res.body.message).toContain('Invalid event type');
    });
  });

  describe('GET /api/events/:id - Get Event by ID', () => {
    let createdEvent;

    beforeEach(async () => {
      createdEvent = await Event.create({
        title: 'Test Event',
        start_date: new Date('2025-12-20T10:00:00Z'),
        end_date: new Date('2025-12-20T11:00:00Z'),
        type: 'feeding',
        status: 'active'
      });
    });

    it('should return event by valid ID', async () => {
      const res = await request(app)
        .get(`/api/events/${createdEvent._id}`)
        .expect(200);

      expect(res.body._id).toBe(createdEvent._id.toString());
      expect(res.body.title).toBe(createdEvent.title);
    });

    it('should return 404 for non-existent ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/events/${fakeId}`)
        .expect(404);

      expect(res.body.error).toBe(true);
      expect(res.body.message).toContain('Event not found');
    });

    it('should return 400 for invalid ID format', async () => {
      const res = await request(app)
        .get('/api/events/invalid-id')
        .expect(400);

      expect(res.body.error).toBe(true);
      expect(res.body.message).toContain('Invalid event ID format');
    });
  });

  describe('PUT /api/events/:id - Update Event', () => {
    let createdEvent;

    beforeEach(async () => {
      createdEvent = await Event.create({
        title: 'Original Title',
        description: 'Original Description',
        start_date: new Date('2025-12-20T10:00:00Z'),
        end_date: new Date('2025-12-20T11:00:00Z'),
        type: 'feeding',
        status: 'active'
      });
    });

    it('should update event with valid data', async () => {
      const updates = {
        title: 'Updated Title',
        description: 'Updated Description',
        type: 'show'
      };

      const res = await request(app)
        .put(`/api/events/${createdEvent._id}`)
        .send(updates)
        .expect(200);

      expect(res.body.title).toBe(updates.title);
      expect(res.body.description).toBe(updates.description);
      expect(res.body.type).toBe(updates.type);
    });

    it('should update only provided fields', async () => {
      const updates = { title: 'Only Title Updated' };

      const res = await request(app)
        .put(`/api/events/${createdEvent._id}`)
        .send(updates)
        .expect(200);

      expect(res.body.title).toBe(updates.title);
      expect(res.body.description).toBe(createdEvent.description); // Unchanged
    });

    it('should reject update with invalid dates', async () => {
      const updates = {
        start_date: '2025-12-20T11:00:00Z',
        end_date: '2025-12-20T10:00:00Z' // Before start_date
      };

      const res = await request(app)
        .put(`/api/events/${createdEvent._id}`)
        .send(updates)
        .expect(400);

      expect(res.body.error).toBe(true);
    });

    it('should return 404 for non-existent ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/events/${fakeId}`)
        .send({ title: 'Updated' })
        .expect(404);

      expect(res.body.error).toBe(true);
      expect(res.body.message).toContain('Event not found');
    });

    it('should return 400 for invalid ID format', async () => {
      const res = await request(app)
        .put('/api/events/invalid-id')
        .send({ title: 'Updated' })
        .expect(400);

      expect(res.body.error).toBe(true);
      expect(res.body.message).toContain('Invalid event ID format');
    });
  });

  describe('DELETE /api/events/:id - Delete Event', () => {
    let createdEvent;

    beforeEach(async () => {
      createdEvent = await Event.create({
        title: 'Event to Delete',
        start_date: new Date('2025-12-20T10:00:00Z'),
        end_date: new Date('2025-12-20T11:00:00Z'),
        type: 'feeding',
        status: 'active'
      });
    });

    it('should delete event by ID', async () => {
      await request(app)
        .delete(`/api/events/${createdEvent._id}`)
        .expect(204);

      // Verify deletion
      const found = await Event.findById(createdEvent._id);
      expect(found).toBeNull();
    });

    it('should return 404 for non-existent ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/events/${fakeId}`)
        .expect(404);

      expect(res.body.error).toBe(true);
      expect(res.body.message).toContain('Event not found');
    });

    it('should return 400 for invalid ID format', async () => {
      const res = await request(app)
        .delete('/api/events/invalid-id')
        .expect(400);

      expect(res.body.error).toBe(true);
      expect(res.body.message).toContain('Invalid event ID format');
    });
  });

  describe('Complete CRUD Workflow', () => {
    it('should create, read, update, and delete an event', async () => {
      // CREATE
      const createRes = await request(app)
        .post('/api/events')
        .send({
          title: 'Workflow Test Event',
          description: 'Testing complete CRUD workflow',
          start_date: '2025-12-20T10:00:00Z',
          end_date: '2025-12-20T11:00:00Z',
          type: 'workshop'
        })
        .expect(201);

      const eventId = createRes.body._id;
      expect(eventId).toBeDefined();

      // READ
      const readRes = await request(app)
        .get(`/api/events/${eventId}`)
        .expect(200);

      expect(readRes.body.title).toBe('Workflow Test Event');

      // UPDATE
      const updateRes = await request(app)
        .put(`/api/events/${eventId}`)
        .send({ title: 'Updated Workflow Event' })
        .expect(200);

      expect(updateRes.body.title).toBe('Updated Workflow Event');

      // DELETE
      await request(app)
        .delete(`/api/events/${eventId}`)
        .expect(204);

      // Verify deletion
      await request(app)
        .get(`/api/events/${eventId}`)
        .expect(404);
    });
  });
});
