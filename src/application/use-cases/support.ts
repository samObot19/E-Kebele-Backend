import { ISupportRepository } from '../../domain/repositories/ISupportRepository';
import { Support } from '../../domain/entities/Support';

export class SupportUseCase {
  constructor(private supportRepository: ISupportRepository) {}

  // Create a new support ticket
  public async createSupportTicket(ticketData: Support): Promise<Support> {
    return this.supportRepository.createSupportTicket(ticketData);
  }

  // Retrieve a support ticket by its ID
  public async getSupportTicketById(ticketId: string): Promise<Support | null> {
    return this.supportRepository.getSupportTicketById(ticketId);
  }

  // Update an existing support ticket
  public async updateSupportTicket(ticketId: string, updates: Partial<Support>): Promise<Support | null> {
    return this.supportRepository.updateSupportTicket(ticketId, updates);
  }

  // Delete a support ticket by its ID
  public async deleteSupportTicket(ticketId: string): Promise<boolean> {
    return this.supportRepository.deleteSupportTicket(ticketId);
  }

  // List all support tickets
  public async listSupportTickets(): Promise<Support[]> {
    return this.supportRepository.listSupportTickets();
  }
}