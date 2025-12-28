// test/unit/bookings.test.js
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  listUserBookings,
  getBookingById,
  cancelBooking,
  reprogramBooking
} from '../../src/controllers/booking.controller.js';

describe('Booking Controller', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      params: {},
      body: {},
      user: { id: 'user123' }
    };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    mockNext = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('listUserBookings', () => {
    it('should return 401 if user not authenticated', async () => {
      mockReq.user = undefined;
      
      await listUserBookings(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: true })
      );
    });
  });

  describe('cancelBooking', () => {
    it('should return 401 if user not authenticated', async () => {
      mockReq.user = undefined;
      mockReq.params.id = '507f1f77bcf86cd799439011';
      
      await cancelBooking(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it('should return 400 for invalid booking ID format', async () => {
      mockReq.params.id = 'invalid-id';
      
      await cancelBooking(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ 
          error: true, 
          message: expect.stringContaining('Invalid booking ID format')
        })
      );
    });
  });

  describe('reprogramBooking', () => {
    it('should return 400 if neither eventId nor newDate provided', async () => {
      mockReq.params.id = '507f1f77bcf86cd799439011';
      mockReq.body = {};
      
      await reprogramBooking(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ 
          error: true, 
          message: expect.stringContaining('eventId or newDate')
        })
      );
    });

    it('should return 401 if user not authenticated', async () => {
      mockReq.user = undefined;
      mockReq.params.id = '507f1f77bcf86cd799439011';
      mockReq.body.eventId = '507f1f77bcf86cd799439012';
      
      await reprogramBooking(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it('should return 400 for invalid booking ID format', async () => {
      mockReq.params.id = 'invalid-id';
      mockReq.body.eventId = '507f1f77bcf86cd799439012';
      
      await reprogramBooking(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ 
          error: true, 
          message: expect.stringContaining('Invalid booking ID format')
        })
      );
    });

    it('should return 400 for invalid new date format', async () => {
      mockReq.params.id = '507f1f77bcf86cd799439011';
      mockReq.body.newDate = 'invalid-date';
      
      await reprogramBooking(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ 
          error: true, 
          message: expect.stringContaining('Invalid date format')
        })
      );
    });

    it('should return 400 for past date', async () => {
      mockReq.params.id = '507f1f77bcf86cd799439011';
      const pastDate = new Date('2020-01-01').toISOString();
      mockReq.body.newDate = pastDate;
      
      await reprogramBooking(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ 
          error: true, 
          message: expect.stringContaining('past date')
        })
      );
    });
  });

  describe('getBookingById', () => {
    it('should return 401 if user not authenticated', async () => {
      mockReq.user = undefined;
      mockReq.params.id = '507f1f77bcf86cd799439011';
      
      await getBookingById(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it('should return 400 for invalid booking ID format', async () => {
      mockReq.params.id = 'invalid-id';
      
      await getBookingById(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ 
          error: true, 
          message: expect.stringContaining('Invalid booking ID format')
        })
      );
    });
  });
});
