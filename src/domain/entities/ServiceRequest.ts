export interface ServiceRequest {
  requestId: string;
  userId: string;
  type: string;
  status: string;
  documents: string[];
}