export interface Document {
  userid: string;
  documentId: string;
  type: string;
  status: string;
  link: string;
  userId: string;
  title: string;
  description?: string;
  documentNumber: string;
  issuedDate?: Date;
  expiryDate?: Date;
  metadata?: Record<string, any>;
}