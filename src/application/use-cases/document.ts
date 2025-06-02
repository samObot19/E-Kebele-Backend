import { IDocumentRepository } from '../../domain/repositories/IDocumentRepository';
import { Document } from '../../domain/entities/Document';

export class DocumentUseCase {
  constructor(private documentRepository: IDocumentRepository) {}

  // Create a new document
  public async createDocument(documentData: Document): Promise<Document> {
    return this.documentRepository.create(documentData);
  }

  // Retrieve a document by its ID
  public async getDocumentById(documentId: string): Promise<Document | null> {
    return this.documentRepository.findById(documentId);
  }

  // Retrieve all documents
  public async getAllDocuments(): Promise<Document[]> {
    return this.documentRepository.findAll();
  }

  // Update an existing document
  public async updateDocument(documentId: string, documentData: Partial<Document>): Promise<Document | null> {
    return this.documentRepository.update(documentId, documentData);
  }

  // Delete a document by its ID
  public async deleteDocument(documentId: string): Promise<boolean> {
    return this.documentRepository.delete(documentId);
  }

  // Get all documents by user ID
  public async getDocumentsByUserId(userId: string): Promise<Document[]> {
    return this.documentRepository.findByUserId(userId);
  }
}