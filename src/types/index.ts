export type User = {
  userId: string;
  name: string;
  role: string;
  status: string;
};

export type ServiceRequest = {
  requestId: string;
  userId: string;
  type: string;
  status: string;
  documents: string[];
};

export type Queue = {
  requestId: string;
  priority: number;
};

export type PublicEvent = {
  eventId: string;
  title: string;
  date: Date;
  location: string;
};

export type Notification = {
  notificationId: string;
  message: string;
  channel: string;
};

export type Document = {
  documentId: string;
  type: string;
  status: string;
};

export type Support = {
  faqId: string;
  question: string;
  answer: string;
};