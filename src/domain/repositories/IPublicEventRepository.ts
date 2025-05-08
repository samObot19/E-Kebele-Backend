import { PublicEvent } from '../entities/PublicEvent';

export interface IPublicEventRepository {
    create(event: PublicEvent): Promise<PublicEvent>;
    findById(eventId: string): Promise<PublicEvent | null>;
    findAll(): Promise<PublicEvent[]>;
    update(eventId: string, event: Partial<PublicEvent>): Promise<PublicEvent | null>;
    delete(eventId: string): Promise<boolean>;
}