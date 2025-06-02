import { Request, Response } from 'express';
import { DocumentUseCase } from '../../application/use-cases/document';
import { Document } from '../../domain/entities/Document';

export class DocumentController {
  constructor(private documentUseCase: DocumentUseCase) {}

  public async createDocument(req: Request, res: Response): Promise<void> {
    try {
      const documentData: Document = req.body;
      const newDocument = await this.documentUseCase.createDocument(documentData);
      res.status(201).json(newDocument);
    } catch (error) {
      res.status(500).json({ message: 'Error creating document', error });
    }
  }

  public async getDocument(req: Request, res: Response): Promise<void> {
    try {
      if (req.params.id) {
        const documentId = req.params.id;
        const document = await this.documentUseCase.getDocumentById(documentId);
        if (!document) {
          res.status(404).json({ message: 'Document not found' });
          return;
        }
        res.status(200).json(document);
      } else {
        const documents = await this.documentUseCase.getAllDocuments();
        res.status(200).json(documents);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving document', error });
    }
  }

  public async getDocumentsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const documents = await this.documentUseCase.getDocumentsByUserId(userId);
      res.status(200).json(documents);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving user documents',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  public async updateDocument(req: Request, res: Response): Promise<void> {
    try {
      const documentId = req.params.id;
      const documentData: Partial<Document> = req.body;
      const updatedDocument = await this.documentUseCase.updateDocument(documentId, documentData);
      if (!updatedDocument) {
        res.status(404).json({ message: 'Document not found' });
        return;
      }
      res.status(200).json(updatedDocument);
    } catch (error) {
      res.status(500).json({ message: 'Error updating document', error });
    }
  }

  public async deleteDocument(req: Request, res: Response): Promise<void> {
    try {
      const documentId = req.params.id;
      const deleted = await this.documentUseCase.deleteDocument(documentId);
      if (!deleted) {
        res.status(404).json({ message: 'Document not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting document', error });
    }
  }
}