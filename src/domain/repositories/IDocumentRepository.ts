import { Document } from '../entities/Document';

export interface IDocumentRepository {
    create(document: Document): Promise<Document>;
    findById(documentId: string): Promise<Document | null>;
    update(documentId: string, document: Partial<Document>): Promise<Document | null>;
    delete(documentId: string): Promise<boolean>;
    findAll(): Promise<Document[]>;
    findByUserId(userId: string): Promise<Document[]>;
}