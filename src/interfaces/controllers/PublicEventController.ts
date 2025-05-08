import { Request, Response } from 'express';
import { PublicEventUseCase } from '../../application/use-cases/public-event';

export class PublicEventController {
  constructor(private publicEventUseCase: PublicEventUseCase) {}

  // Create a new public event
  public async createEvent(req: Request, res: Response): Promise<void> {
    try {
      const eventData = req.body;
      const newEvent = await this.publicEventUseCase.createEvent(eventData);
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(500).json({ message: 'Error creating event', error });
    }
  }

  // Get all public events
  public async getEvents(req: Request, res: Response): Promise<void> {
    try {
      const events = await this.publicEventUseCase.getAllEvents();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving events', error });
    }
  }

  // Get a public event by ID
  public async getEventById(req: Request, res: Response): Promise<void> {
    try {
      const eventId = req.params.id;
      const event = await this.publicEventUseCase.getEventById(eventId);
      if (!event) {
        res.status(404).json({ message: 'Event not found' });
        return;
      }
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving event', error });
    }
  }

  // Update a public event
  public async updateEvent(req: Request, res: Response): Promise<void> {
    try {
      const eventId = req.params.id;
      const eventData = req.body;
      const updatedEvent = await this.publicEventUseCase.updateEvent(eventId, eventData);
      if (!updatedEvent) {
        res.status(404).json({ message: 'Event not found' });
        return;
      }
      res.status(200).json(updatedEvent);
    } catch (error) {
      res.status(500).json({ message: 'Error updating event', error });
    }
  }

  // Delete a public event
  public async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      const eventId = req.params.id;
      const deleted = await this.publicEventUseCase.deleteEvent(eventId);
      if (!deleted) {
        res.status(404).json({ message: 'Event not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting event', error });
    }
  }
}

