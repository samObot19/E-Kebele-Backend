import { ISupportRepository } from '../../domain/repositories/ISupportRepository';
import { Support } from '../../domain/entities/Support';

export class SupportRepository implements ISupportRepository {
  private supports: Support[] = [];
  createSupportTicket(ticket: Support): Promise<Support> {
    throw new Error('Method not implemented.');
  }
  getSupportTicketById(ticketId: string): Promise<Support | null> {
    throw new Error('Method not implemented.');
  }
  updateSupportTicket(ticketId: string, updates: Partial<Support>): Promise<Support | null> {
    throw new Error('Method not implemented.');
  }
  deleteSupportTicket(ticketId: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  listSupportTickets(): Promise<Support[]> {
    throw new Error('Method not implemented.');
  }
}