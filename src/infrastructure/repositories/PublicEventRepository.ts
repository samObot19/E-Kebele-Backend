import { IPublicEventRepository } from '../../domain/repositories/IPublicEventRepository';
import { PublicEvent } from '../../domain/entities/PublicEvent';

export class PublicEventRepository implements IPublicEventRepository {
  private events: PublicEvent[] = [];

  async create(event: PublicEvent): Promise<PublicEvent> {
    this.events.push(event);
    return event;
  }

  async findById(eventId: string): Promise<PublicEvent | null> {
    return this.events.find(event => event.eventId === eventId) || null;
  }

  async findAll(): Promise<PublicEvent[]> {
    return this.events;
  }

  async update(eventId: string, updatedEvent: PublicEvent): Promise<PublicEvent | null> {
    const index = this.events.findIndex(event => event.eventId === eventId);
    if (index === -1) return null;
    this.events[index] = { ...this.events[index], ...updatedEvent };
    return this.events[index];
  }

  async delete(eventId: string): Promise<boolean> {
    const index = this.events.findIndex(event => event.eventId === eventId);
    if (index === -1) return false;
    this.events.splice(index, 1);
    return true;
  }
}