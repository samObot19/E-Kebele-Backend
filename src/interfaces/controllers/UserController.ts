import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export class UserController {
  // Register by email
  public async registerUser(req: Request, res: Response): Promise<void> {
    const { name, address, phone, idNumber, role, adminCredentials } = req.body;

    if (!name || !address || !phone || !idNumber || !role) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    try {
      const existingUser = await User.findOne({ idNumber });
      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      const newUser = new User({
        name,
        address,
        phone,
        idNumber,
        role,
        adminCredentials,
        status: "Pending",
      });

      await newUser.save();

      const token = jwt.sign(
        { userId: newUser._id, role: newUser.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      res.cookie("token", token, {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
      });

      res.status(201).json({
        userId: newUser._id,
        role: newUser.role,
        status: newUser.status,
        message: "User registered successfully",
        token,
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Registration error", error: error.message });
    }
  }

  // Login by email
  public async loginUser(req: Request, res: Response): Promise<void> {
    const { idNumber } = req.body;
    try {
      const user = await User.findOne({ idNumber });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        token,
        userId: user._id,
        role: user.role,
        status: user.status,
      });
    } catch (error) {
      res.status(500).json({ message: "Login error", error });
    }
  }

  // Register/Login using Google
  public async googleAuth(req: Request, res: Response): Promise<void> {
    const { tokenId } = req.body;

    try {
      const ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email || !payload.name) {
        res.status(400).json({ message: "Invalid Google token" });
        return;
      }

      let user = await User.findOne({ idNumber: payload.email });

      if (!user) {
        user = new User({
          name: payload.name,
          address: "Google Provided",
          phone: "N/A",
          idNumber: payload.email,
          role: "Resident",
          status: "Pending",
        });
        await user.save();
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        token,
        userId: user._id,
        role: user.role,
        status: user.status,
        isNewUser: !user,
      });
    } catch (error) {
      res.status(500).json({ message: "Google authentication failed", error });
    }
  }

  // Logout
  public async logoutUser(req: Request, res: Response): Promise<void> {
    res.status(200).json({ message: "Logged out successfully" });
  }

  // Get user by ID
  public async getUserById(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    const { userId } = req.params;
    const requestingUser = req.user;

    try {
      if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }

      if (!requestingUser) {
        res.status(401).json({ message: "Unauthorized: No user info found" });
        return;
      }

      const isAdmin =
        requestingUser.role === "GoxeAdmin" ||
        requestingUser.role === "KebeleAdmin";

      if (!isAdmin && requestingUser.userId !== userId) {
        res.status(403).json({
          message:
            "Access denied. You can only view your own profile unless you're an admin.",
        });
        return;
      }

      // Find user in the database
      const user = await User.findById(userId).select("-password -__v").lean();

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const response = {
        userId: user._id,
        role: user.role,
        name: user.name,
        status: user.status,
      };

      res.status(200).json(response);
    } catch (error: any) {
      console.error("Error fetching user:", error);
      res.status(500).json({
        message: "Error retrieving user data",
        error: error.message,
      });
    }
  }

  // Verify user by admin
  public async verifyUser(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const { status, reason } = req.body;
    const requestingUser = req.user;

    try {
      if (!requestingUser || requestingUser.role !== "GoxeAdmin") {
        res.status(403).json({ message: "Only GoxeAdmin can verify users." });
        return;
      }

      if (!["Verified", "Rejected"].includes(status)) {
        res
          .status(400)
          .json({ message: "Status must be 'Verified' or 'Rejected'." });
        return;
      }

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      user.status = status;
      if (reason) user.verificationReason = reason;
      await user.save();

      res.status(200).json({
        userId: user._id,
        status: user.status,
      });
    } catch (error: any) {
      console.error("Verification error:", error);
      res.status(500).json({
        message: "Failed to verify user",
        error: error.message,
      });
    }
  }

  // Approve or reject user access
  public async approveUser(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    const { userId } = req.params;
    const { status, reason } = req.body;
    const requestingUser = req.user;

    try {
      if (!requestingUser || requestingUser.role !== "KebeleAdmin") {
        res
          .status(403)
          .json({
            message: "Only KebeleAdmin can approve or reject user roles.",
          });
        return;
      }

      if (!["Approved", "Rejected"].includes(status)) {
        res
          .status(400)
          .json({ message: "Status must be either 'Approved' or 'Rejected'" });
        return;
      }

      const user = await User.findById(userId).exec();

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      user.status = status;
      if (status === "Rejected" && reason) {
        user.verificationReason = reason;
      }

      await user.save();

      res.status(200).json({
        userId: user._id,
        status: user.status,
        verificationReason: user.verificationReason || null,
      });
    } catch (error: any) {
      console.error("Error approving user:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
}
