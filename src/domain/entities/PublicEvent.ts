export class PublicEvent {
    eventId: string;
    title: string;
    date: Date;
    location: string;

    constructor(eventId: string, title: string, date: Date, location: string) {
        this.eventId = eventId;
        this.title = title;
        this.date = date;
        this.location = location;
    }
}