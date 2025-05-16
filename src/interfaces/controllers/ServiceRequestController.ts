import { Request, Response } from "express";

import  ServiceRequestDocument from "../models/ServiceRequest"; // Assuming you have a ServiceRequest model

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export class ServiceRequestController {


    // Method to create a new service request
  public async createServiceRequest(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    const { type, documents, previousIdDetails } = req.body;
    const requestingUser = req.user;

    try {
  
      if (!requestingUser || requestingUser.role !== "Resident") {
        res
          .status(403)
          .json({ message: "Only Residents can submit service requests." });
        return;
      }

      if (!["NewID", "Renewal"].includes(type)) {
        res.status(400).json({ message: "Type must be 'NewID' or 'Renewal'" });
        return;
      }

      if (type === "Renewal" && !previousIdDetails) {
        res
          .status(400)
          .json({
            message: "Previous ID details are required for Renewal requests.",
          });
        return;
        }
      const newServiceRequest = new ServiceRequestDocument({
        userId: requestingUser.userId,
        type,
        documents,
        previousIdDetails: type === "Renewal" ? previousIdDetails : null,
        status: "Queued", 
        confirmationReceipt: `SR-${Date.now()}-${Math.floor(Math.random() * 1000)}`, 
      });

      const savedRequest = await newServiceRequest.save();
      res.status(201).json({
        requestId: savedRequest._id,
        status: savedRequest.status,
        confirmationReceipt: savedRequest.confirmationReceipt,
      });
    } catch (error: any) {
      console.error("Error creating service request:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }

    // Method to get all service requests
  public async getAllServiceRequests(
    req: Request,
    res: Response
  ): Promise<void> {
    const {
      status,
      priority,
      userId,
      page = "1",
      limit = "10",
    } = req.query as {
      status?: string;
      priority?: string;
      userId?: string;
      page?: string;
      limit?: string;
    };

    try {
      const query: any = {};

      const requestingUser = req.user;

      if (!requestingUser || !requestingUser.userId || !requestingUser.role) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      if (requestingUser.role === "Resident") {
        query.userId = requestingUser.userId;
      } else if (userId) {
        query.userId = userId;
      }

      if (status) query.status = status;
      if (priority) query.priority = priority;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [requests, total] = await Promise.all([
        ServiceRequestDocument.find(query)
          .skip(skip)
          .limit(parseInt(limit))
          .select("userId type status priority estimatedProcessingTime"),
        ServiceRequestDocument.countDocuments(query),
      ]);

      const formatted = requests.map((req) => ({
        requestId: req._id,
        userId: req.userId,
        type: req.type,
        status: req.status,
        priority: req.priority,
        estimatedProcessingTime: req.estimatedProcessingTime,
      }));

      res.status(200).json({ requests: formatted, total });
    } catch (error: any) {
      console.error("Error retrieving service requests:", error);
      res.status(500).json({
        message: "Failed to fetch service requests",
        error: error.message,
      });
    }
  }

    // Method to get a service request by ID
  public async getServiceRequestById(req: Request, res: Response): Promise<void> {
    const { requestId } = req.params;
    const requestingUser = req.user;

    if (!requestingUser) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const serviceRequest = await ServiceRequestDocument.findById(requestId);

      if (!serviceRequest) {
        res.status(404).json({ message: "Service request not found" });
        return;
      }

      const isAdmin = requestingUser.role === "GoxeAdmin" || requestingUser.role === "KebeleAdmin";
      const isOwner = serviceRequest.userId.toString() === requestingUser.userId;

      if (!isAdmin && !isOwner) {
        res.status(403).json({ message: "Access denied" });
        return;
      }

      res.status(200).json({
        requestId: serviceRequest._id,
        userId: serviceRequest.userId,
        type: serviceRequest.type,
        status: serviceRequest.status,
        documents: serviceRequest.documents
      });
    } catch (error: any) {
      console.error("Error retrieving service request:", error);
      res.status(500).json({
        message: "Failed to retrieve service request",
        error: error.message
      });
    }
  }

 // Method to update a service request
   public async updateServiceRequest(req: Request, res: Response): Promise<void> {
    const { requestId } = req.params;
    const requestingUser = req.user;

    if (!requestingUser || !["GoxeAdmin", "KebeleAdmin"].includes(requestingUser.role)) {
      res.status(403).json({ message: "Access denied: only admins can update service requests" });
      return;
    }

    const { status, additionalInfo, documents } = req.body;

    try {
      const updatedRequest = await ServiceRequestDocument.findByIdAndUpdate(
        requestId,
        {
          status,
          additionalInfo,
          ...(documents ? { documents } : {})
        },
        { new: true } 
      );

      if (!updatedRequest) {
        res.status(404).json({ message: "Service request not found" });
        return;
      }

      res.status(200).json({
        requestId: updatedRequest._id,
        status: updatedRequest.status
      });
    } catch (error: any) {
      console.error("Error updating service request:", error);
      res.status(500).json({
        message: "Failed to update service request",
        error: error.message
      });
    }
  }
}
