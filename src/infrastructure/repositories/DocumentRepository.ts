import { IDocumentRepository } from '../../domain/repositories/IDocumentRepository';
import { Document } from '../../domain/entities/Document';

export class DocumentRepository implements IDocumentRepository {
  private documents: Document[] = [];

  async create(document: Document): Promise<Document> {
    this.documents.push(document);
    return document;
  }

  async findById(documentId: string): Promise<Document | null> {
    return this.documents.find(doc => doc.documentId === documentId) || null;
  }

  async update(documentId: string, updatedDocument: Document): Promise<Document | null> {
    const index = this.documents.findIndex(doc => doc.documentId === documentId);
    if (index === -1) return null;
    this.documents[index] = { ...this.documents[index], ...updatedDocument };
    return this.documents[index];
  }

  async delete(documentId: string): Promise<boolean> {
    const index = this.documents.findIndex(doc => doc.documentId === documentId);
    if (index === -1) return false;
    this.documents.splice(index, 1);
    return true;
  }

  async findAll(): Promise<Document[]> {
    return this.documents;
  }

  async findByUserId(userId: string): Promise<Document[]> {
    return this.documents.filter(doc => doc.userId === userId);
  }
}