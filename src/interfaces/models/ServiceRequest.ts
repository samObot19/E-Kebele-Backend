import mongoose, { Schema, Document } from "mongoose";

interface DocumentFile {
  name: string;
  url: string;
}

interface PreviousIdDetails {
  idNumber: string;
  issuedDate: Date;
  issuingAuthority: string;
}

export interface ServiceRequestDocument extends Document {
  userId: mongoose.Types.ObjectId;
  type: "NewID" | "Renewal";
  documents: DocumentFile[];
  previousIdDetails?: PreviousIdDetails | null;
  status: string;
  confirmationReceipt: string;
  priority: {
  type: String,
  enum: ['Low', 'Medium', 'High'],
  default: 'Medium'
},
estimatedProcessingTime: {
  type: Number, 
  default: 3 
}

}

const ServiceRequestSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["NewID", "Renewal"],
      required: true,
    },
    documents: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    previousIdDetails: {
      idNumber: { type: String },
      issuedDate: { type: Date },
      issuingAuthority: { type: String },
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    estimatedProcessingTime: {
      type: Number, // in days, hours, or minutes (you decide)
      default: 3, // example default
    },
    status: {
      type: String,
      default: "Queued",
    },
    confirmationReceipt: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ServiceRequestDocument>(
  "ServiceRequest",
  ServiceRequestSchema
);
