
import { describe, it, expect } from "vitest";
import { buildEventFilter, validateEventQueryParams, validateEventData } from "../../src/utils/event.helper.js";

describe("buildEventFilter", () => {
  it("default includes active events with end_date >= now", () => {
    const now = new Date("2025-12-01T12:00:00Z");
    const filter = buildEventFilter({}, now);
    expect(filter).toEqual({ status: "active", end_date: { $gte: now } });
  });

  it("adds type when provided", () => {
    const filter = buildEventFilter({ type: "concert" });
    expect(filter.type).toBe("concert");
  });

  it("adds date overlap constraints", () => {
    const filter = buildEventFilter({ date: "2025-12-20" });
    expect(filter.start_date.$lte instanceof Date).toBe(true);
    expect(filter.end_date.$gte instanceof Date).toBe(true);
  });
});

describe('Events Utility Functions', () => {
  describe('validateEventQueryParams', () => {
    it('should validate correct date format', () => {
      const result = validateEventQueryParams({ date: '2025-12-20' });
      expect(result.valid).toBe(true);
    });

    it('should reject invalid date format', () => {
      const result = validateEventQueryParams({ date: '20-12-2025' });
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Invalid date format');
    });

    it('should reject invalid date values', () => {
      const result = validateEventQueryParams({ date: '2025-13-45' });
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Invalid date');
    });

    it('should validate correct event types', () => {
      const validTypes = ['feeding', 'show', 'workshop', 'tour', 'special', 'conservation'];
      validTypes.forEach(type => {
        const result = validateEventQueryParams({ type });
        expect(result.valid).toBe(true);
      });
    });

    it('should reject invalid event types', () => {
      const result = validateEventQueryParams({ type: 'invalid-type' });
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Invalid event type');
    });

    it('should handle case-insensitive event types', () => {
      const result = validateEventQueryParams({ type: 'FEEDING' });
      expect(result.valid).toBe(true);
    });

    it('should validate both date and type together', () => {
      const result = validateEventQueryParams({
        date: '2025-12-20',
        type: 'workshop'
      });
      expect(result.valid).toBe(true);
    });

    it('should validate empty query params', () => {
      const result = validateEventQueryParams({});
      expect(result.valid).toBe(true);
    });
  });

  describe('buildEventFilter', () => {
    const fixedNow = new Date('2025-12-13T12:00:00Z');

    it('should build default filter for active upcoming events', () => {
      const filter = buildEventFilter({}, fixedNow);

      expect(filter).toHaveProperty('status', 'active');
      expect(filter).toHaveProperty('end_date');
      expect(filter.end_date).toEqual({ $gte: fixedNow });
    });

    it('should add date filter for specific day', () => {
      const filter = buildEventFilter({ date: '2025-12-20' }, fixedNow);

      expect(filter).toHaveProperty('status', 'active');
      expect(filter).toHaveProperty('start_date');
      expect(filter).toHaveProperty('end_date');

      // Should overlap with the specified day
      // Date constructor with single string uses local timezone
      const d = new Date('2025-12-20');
      const expectedStartOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
      const expectedEndOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

      expect(filter.start_date).toEqual({ $lte: expectedEndOfDay });
      expect(filter.end_date.$gte).toEqual(expectedStartOfDay);
    });

    it('should add type filter', () => {
      const filter = buildEventFilter({ type: 'feeding' }, fixedNow);

      expect(filter).toHaveProperty('type', 'feeding');
      expect(filter).toHaveProperty('status', 'active');
    });

    it('should normalize type to lowercase', () => {
      const filter = buildEventFilter({ type: 'WORKSHOP' }, fixedNow);

      expect(filter).toHaveProperty('type', 'workshop');
    });

    it('should combine date and type filters', () => {
      const filter = buildEventFilter({
        date: '2025-12-20',
        type: 'show'
      }, fixedNow);

      expect(filter).toHaveProperty('status', 'active');
      expect(filter).toHaveProperty('type', 'show');
      expect(filter).toHaveProperty('start_date');
      expect(filter.end_date).toHaveProperty('$gte');
    });

    it('should handle different date values correctly', () => {
      const testDates = [
        '2025-12-01',
        '2025-12-31',
        '2026-01-01',
        '2025-02-28'
      ];

      testDates.forEach(date => {
        const filter = buildEventFilter({ date }, fixedNow);
        expect(filter).toHaveProperty('start_date');
        expect(filter).toHaveProperty('end_date');
      });
    });

    it('should maintain active status filter with all combinations', () => {
      const filters = [
        buildEventFilter({}, fixedNow),
        buildEventFilter({ date: '2025-12-20' }, fixedNow),
        buildEventFilter({ type: 'show' }, fixedNow),
        buildEventFilter({ date: '2025-12-20', type: 'tour' }, fixedNow)
      ];

      filters.forEach(filter => {
        expect(filter.status).toBe('active');
      });
    });

    it('should use provided now parameter for time-based filtering', () => {
      const customNow = new Date('2026-01-01T00:00:00Z');
      const filter = buildEventFilter({}, customNow);

      expect(filter.end_date).toEqual({ $gte: customNow });
    });
  });

  describe('validateEventData', () => {
    it('should validate correct event data', () => {
      const data = {
        title: 'Test Event',
        start_date: '2025-12-20T10:00:00Z',
        end_date: '2025-12-20T11:00:00Z',
        type: 'feeding'
      };
      const result = validateEventData(data);
      expect(result.valid).toBe(true);
    });

    it('should reject missing title', () => {
      const data = {
        start_date: '2025-12-20T10:00:00Z',
        end_date: '2025-12-20T11:00:00Z'
      };
      const result = validateEventData(data);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Title is required');
    });

    it('should reject empty title', () => {
      const data = {
        title: '   ',
        start_date: '2025-12-20T10:00:00Z',
        end_date: '2025-12-20T11:00:00Z'
      };
      const result = validateEventData(data);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Title is required');
    });

    it('should reject missing start_date', () => {
      const data = {
        title: 'Test Event',
        end_date: '2025-12-20T11:00:00Z'
      };
      const result = validateEventData(data);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('start_date is required');
    });

    it('should reject missing end_date', () => {
      const data = {
        title: 'Test Event',
        start_date: '2025-12-20T10:00:00Z'
      };
      const result = validateEventData(data);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('end_date is required');
    });

    it('should reject invalid start_date', () => {
      const data = {
        title: 'Test Event',
        start_date: 'invalid-date',
        end_date: '2025-12-20T11:00:00Z'
      };
      const result = validateEventData(data);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Invalid start_date');
    });

    it('should reject invalid end_date', () => {
      const data = {
        title: 'Test Event',
        start_date: '2025-12-20T10:00:00Z',
        end_date: 'invalid-date'
      };
      const result = validateEventData(data);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Invalid end_date');
    });

    it('should reject end_date before start_date', () => {
      const data = {
        title: 'Test Event',
        start_date: '2025-12-20T11:00:00Z',
        end_date: '2025-12-20T10:00:00Z'
      };
      const result = validateEventData(data);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('end_date must be after start_date');
    });

    it('should reject invalid event type', () => {
      const data = {
        title: 'Test Event',
        start_date: '2025-12-20T10:00:00Z',
        end_date: '2025-12-20T11:00:00Z',
        type: 'invalid-type'
      };
      const result = validateEventData(data);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Invalid event type');
    });

    it('should accept all valid event types', () => {
      const validTypes = ['feeding', 'show', 'workshop', 'tour', 'special', 'conservation'];
      validTypes.forEach(type => {
        const data = {
          title: 'Test Event',
          start_date: '2025-12-20T10:00:00Z',
          end_date: '2025-12-20T11:00:00Z',
          type
        };
        const result = validateEventData(data);
        expect(result.valid).toBe(true);
      });
    });
  });
});
