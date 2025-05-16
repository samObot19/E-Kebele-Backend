import express from "express";
import { ServiceRequestController } from "../controllers/ServiceRequestController";
import { authenticate } from "../middlewares/authenticate"; // Middleware to check authentication

const router = express.Router();
const serviceRequestController = new ServiceRequestController();

// Route to submit a service request
router.post(
  "/service-requests",
  authenticate, // Ensure the user is authenticated and is a "Resident"
  (req, res) => serviceRequestController.createServiceRequest(req, res)
);

router.get(
  "/",
  authenticate,
  (req, res) => serviceRequestController.getAllServiceRequests(req, res)
);

router.get(
  "/service-requests/:requestId",
  authenticate,
  (req, res) => serviceRequestController.getServiceRequestById(req, res)
);


router.put(
  "/service-requests/:requestId",
  authenticate,
  (req, res) => serviceRequestController.updateServiceRequest(req, res)
);
export default router;
