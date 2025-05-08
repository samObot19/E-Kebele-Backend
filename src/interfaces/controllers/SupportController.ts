import { Request, Response } from 'express';
import { SupportUseCase } from '../../application/use-cases/support';

export class SupportController {
  constructor(private supportUseCase: SupportUseCase) {}

  // Create a new support ticket
  public async createSupportTicket(req: Request, res: Response): Promise<void> {
    try {
      const ticketData = req.body;
      const newTicket = await this.supportUseCase.createSupportTicket(ticketData);
      res.status(201).json(newTicket);
    } catch (error) {
      res.status(500).json({ message: 'Error creating support ticket', error });
    }
  }

  // Get all support tickets
  public async listSupportTickets(req: Request, res: Response): Promise<void> {
    try {
      const tickets = await this.supportUseCase.listSupportTickets();
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving support tickets', error });
    }
  }

  // Get a support ticket by ID
  public async getSupportTicketById(req: Request, res: Response): Promise<void> {
    try {
      const { ticketId } = req.params;
      const ticket = await this.supportUseCase.getSupportTicketById(ticketId);
      if (ticket) {
        res.status(200).json(ticket);
      } else {
        res.status(404).json({ message: 'Support ticket not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving support ticket', error });
    }
  }

  // Update a support ticket
  public async updateSupportTicket(req: Request, res: Response): Promise<void> {
    try {
      const { ticketId } = req.params;
      const updates = req.body;
      const updatedTicket = await this.supportUseCase.updateSupportTicket(ticketId, updates);
      if (updatedTicket) {
        res.status(200).json(updatedTicket);
      } else {
        res.status(404).json({ message: 'Support ticket not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating support ticket', error });
    }
  }

  // Delete a support ticket
  public async deleteSupportTicket(req: Request, res: Response): Promise<void> {
    try {
      const { ticketId } = req.params;
      const deleted = await this.supportUseCase.deleteSupportTicket(ticketId);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Support ticket not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting support ticket', error });
    }
  }
}

