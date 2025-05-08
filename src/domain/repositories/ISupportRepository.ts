import type { Support } from '../entities/Support';

export interface ISupportRepository {
    createSupportTicket(ticket: Support): Promise<Support>;
    getSupportTicketById(ticketId: string): Promise<Support | null>;
    updateSupportTicket(ticketId: string, updates: Partial<Support>): Promise<Support | null>;
    deleteSupportTicket(ticketId: string): Promise<boolean>;
    listSupportTickets(): Promise<Support[]>;
}