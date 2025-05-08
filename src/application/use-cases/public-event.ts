// This file contains use case implementations for managing public events. 

import { IPublicEventRepository } from '../../domain/repositories/IPublicEventRepository';
import { PublicEvent } from '../../domain/entities/PublicEvent';

export class PublicEventUseCase {
    private publicEventRepository: IPublicEventRepository;

    constructor(publicEventRepository: IPublicEventRepository) {
        this.publicEventRepository = publicEventRepository;
    }

    async createEvent(eventData: Omit<PublicEvent, 'eventId'>): Promise<PublicEvent> {
        const { title, date, location } = eventData;
        const newEvent = new PublicEvent('', title, date, location);
        return await this.publicEventRepository.create(newEvent);
    }

    async getEventById(eventId: string): Promise<PublicEvent | null> {
        return await this.publicEventRepository.findById(eventId);
    }

    async getAllEvents(): Promise<PublicEvent[]> {
        return await this.publicEventRepository.findAll();
    }

    async updateEvent(eventId: string, eventData: Partial<PublicEvent>): Promise<PublicEvent | null> {
        return await this.publicEventRepository.update(eventId, eventData);
    }

    async deleteEvent(eventId: string): Promise<boolean> {
        return await this.publicEventRepository.delete(eventId);
    }
}