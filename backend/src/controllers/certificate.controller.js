import { Certificate } from "../models/certificate.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandlers.js";
import path from 'path';
import fs from 'fs';

// Create certificate
const createCertificate = asyncHandler(async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const userId = req.user._id;
    const userEmail = req.user.email;

    if (!title || !description || !category) {
      throw new ApiError(400, "Title, description, and category are required");
    }

    if (!req.file) {
      throw new ApiError(400, "Certificate image is required");
    }

    // Create certificate with image path
    const certificate = await Certificate.create({
      title,
      description,
      category,
      imageUrl: `/uploads/${req.file.filename}`,
      userId,
      userEmail,
      points: 0 // Default to 0 points until verified
    });

    return res.status(201).json({
      success: true,
      message: "Certificate uploaded successfully",
      data: certificate
    });

  } catch (error) {
    console.error("Certificate creation error:", error);
    throw new ApiError(500, error.message || "Failed to create certificate");
  }
});

// Get user certificates
const getUserCertificates = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    
    const certificates = await Certificate.find({ userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'fullName email');

    return res.status(200).json({
      success: true,
      data: certificates
    });

  } catch (error) {
    console.error("Get certificates error:", error);
    throw new ApiError(500, "Failed to fetch certificates");
  }
});

// Get all certificates (for admin/faculty)
const getAllCertificates = asyncHandler(async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'fullName email role');

    return res.status(200).json({
      success: true,
      data: certificates
    });

  } catch (error) {
    console.error("Get all certificates error:", error);
    throw new ApiError(500, "Failed to fetch certificates");
  }
});

// Update certificate status (for admin/faculty)
const updateCertificateStatus = asyncHandler(async (req, res) => {
  try {
    const { certificateId } = req.params;
    const { status, points } = req.body;

    if (!['Pending', 'Verified', 'Rejected'].includes(status)) {
      throw new ApiError(400, "Invalid status");
    }

    const certificate = await Certificate.findByIdAndUpdate(
      certificateId,
      { status, points: points || 0 },
      { new: true }
    ).populate('userId', 'fullName email');

    if (!certificate) {
      throw new ApiError(404, "Certificate not found");
    }

    return res.status(200).json({
      success: true,
      message: "Certificate status updated successfully",
      data: certificate
    });

  } catch (error) {
    console.error("Update certificate status error:", error);
    throw new ApiError(500, "Failed to update certificate status");
  }
});

export {
  createCertificate,
  getUserCertificates,
  getAllCertificates,
  updateCertificateStatus
};
