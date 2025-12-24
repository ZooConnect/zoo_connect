
// src/controllers/event.controller.js
import Event from "../models/event.model.js";
import { buildEventFilter, validateEventQueryParams, validateEventData } from "../utils/events.js";

/**
 * GET /api/events - List all events with optional filtering
 */
export async function listEvents(req, res, next) {
  try {
    // Validate query parameters
    const validation = validateEventQueryParams(req.query);
    if (!validation.valid) {
      return res.status(400).json({ 
        error: true, 
        message: validation.message 
      });
    }

    const filter = buildEventFilter(req.query);
    const events = await Event.find(filter).sort({ start_date: 1 }).lean();
    
    return res.status(200).json(events);
  } catch (err) {
    console.error('Error in listEvents:', err);
    return next(err);
  }
}

/**
 * GET /api/events/:id - Get a single event by ID
 */
export async function getEventById(req, res, next) {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        error: true, 
        message: 'Invalid event ID format' 
      });
    }

    const event = await Event.findById(id).lean();
    
    if (!event) {
      return res.status(404).json({ 
        error: true, 
        message: 'Event not found' 
      });
    }
    
    return res.status(200).json(event);
  } catch (err) {
    console.error('Error in getEventById:', err);
    return next(err);
  }
}

/**
 * POST /api/events - Create a new event
 */
export async function createEvent(req, res, next) {
  try {
    const { title, description, start_date, end_date, type, status } = req.body;
    
    // Validate required fields and data
    const validation = validateEventData({ title, start_date, end_date, type });
    if (!validation.valid) {
      return res.status(400).json({ 
        error: true, 
        message: validation.message 
      });
    }

    // Normalize type to lowercase before saving
    const normalizedType = type ? String(type).toLowerCase() : undefined;

    // Create event with Mongoose
    const event = await Event.create({
      title,
      description,
      start_date,
      end_date,
      type: normalizedType,
      status: status || 'active'
    });
    
    return res.status(201).json(event);
  } catch (err) {
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: true, 
        message: err.message 
      });
    }
    console.error('Error in createEvent:', err);
    return next(err);
  }
}

/**
 * PUT /api/events/:id - Update an existing event
 */
export async function updateEvent(req, res, next) {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        error: true, 
        message: 'Invalid event ID format' 
      });
    }

    // Find the event first
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({ 
        error: true, 
        message: 'Event not found' 
      });
    }

    // Update fields if provided
    const allowedFields = ['title', 'description', 'start_date', 'end_date', 'type', 'status'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        // Normalize type to lowercase
        if (field === 'type' && req.body[field]) {
          event[field] = String(req.body[field]).toLowerCase();
        } else {
          event[field] = req.body[field];
        }
      }
    });

    // Save (triggers pre-save middleware)
    await event.save();
    
    return res.status(200).json(event);
  } catch (err) {
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: true, 
        message: err.message 
      });
    }
    console.error('Error in updateEvent:', err);
    return next(err);
  }
}

/**
 * DELETE /api/events/:id - Delete an event
 */
export async function deleteEvent(req, res, next) {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        error: true, 
        message: 'Invalid event ID format' 
      });
    }

    const event = await Event.findByIdAndDelete(id);
    
    if (!event) {
      return res.status(404).json({ 
        error: true, 
        message: 'Event not found' 
      });
    }
    
    // 204 No Content - successful deletion
    return res.status(204).end();
  } catch (err) {
    console.error('Error in deleteEvent:', err);
    return next(err);
  }
}
