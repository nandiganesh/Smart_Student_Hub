import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { User } from '../models/user.model.js';
import { Certificate } from '../models/certificate.model.js';
import { asyncHandler } from '../utils/asyncHandlers.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const generatePortfolioPDF = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  // Fetch student information
  const student = await User.findById(studentId).select('-password -refreshToken');
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  // Fetch verified certificates/achievements
  const certificates = await Certificate.find({
    userId: studentId,
    status: 'Verified'
  }).sort({ createdAt: -1 });

  // Calculate statistics
  const totalActivities = certificates.length;
  const totalPoints = certificates.reduce((sum, cert) => sum + (cert.points || 0), 0);
  const categoryCounts = certificates.reduce((acc, cert) => {
    acc[cert.category] = (acc[cert.category] || 0) + 1;
    return acc;
  }, {});

  // Create PDF document
  const doc = new PDFDocument({ 
    size: 'A4', 
    margin: 50,
    info: {
      Title: `${student.fullName} - Portfolio`,
      Author: 'Smart Student Hub',
      Subject: 'Student Portfolio',
      Keywords: 'portfolio, student, achievements'
    }
  });

  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${student.fullName}_Portfolio.pdf"`);

  // Pipe PDF to response
  doc.pipe(res);

  // Colors matching the UI
  const colors = {
    primary: '#f97316', // orange-500
    secondary: '#1f2937', // gray-800
    accent: '#059669', // green-600
    text: '#374151', // gray-700
    lightGray: '#f3f4f6', // gray-100
    white: '#ffffff'
  };

  // Helper function to add header
  const addHeader = () => {
    // Header background
    doc.rect(0, 0, doc.page.width, 120)
       .fill(colors.primary);

    // Logo placeholder (you can add actual logo here)
    doc.circle(70, 60, 25)
       .fill(colors.white);
    
    doc.fontSize(12)
       .fill(colors.primary)
       .text('SSH', 58, 55);

    // Title
    doc.fontSize(24)
       .fill(colors.white)
       .text('STUDENT PORTFOLIO', 120, 35);

    doc.fontSize(12)
       .text('Smart Student Hub - Verified Achievements Report', 120, 65);

    // Student info box
    doc.rect(400, 20, 150, 80)
       .fill(colors.white);

    doc.fontSize(10)
       .fill(colors.secondary)
       .text('Student Information', 410, 30);

    doc.fontSize(9)
       .fill(colors.text)
       .text(`Name: ${student.fullName}`, 410, 45)
       .text(`ID: ${student.studentId || 'N/A'}`, 410, 58)
       .text(`Department: ${student.department || 'N/A'}`, 410, 71)
       .text(`Email: ${student.email}`, 410, 84);
  };

  // Helper function to add summary cards
  const addSummaryCards = (y) => {
    const cardWidth = 120;
    const cardHeight = 60;
    const cardSpacing = 15;
    const startX = 50;

    const stats = [
      { title: 'Total Activities', value: totalActivities, color: colors.primary },
      { title: 'Verified Activities', value: totalActivities, color: colors.accent },
      { title: 'Total Points', value: totalPoints, color: '#8b5cf6' }, // purple
      { title: 'Categories', value: Object.keys(categoryCounts).length, color: '#06b6d4' } // cyan
    ];

    stats.forEach((stat, index) => {
      const x = startX + (cardWidth + cardSpacing) * index;
      
      // Card background
      doc.rect(x, y, cardWidth, cardHeight)
         .fill(colors.white)
         .stroke(colors.lightGray);

      // Colored top border
      doc.rect(x, y, cardWidth, 4)
         .fill(stat.color);

      // Value
      doc.fontSize(20)
         .fill(stat.color)
         .text(stat.value.toString(), x + 10, y + 15);

      // Title
      doc.fontSize(8)
         .fill(colors.text)
         .text(stat.title, x + 10, y + 40, { width: cardWidth - 20 });
    });

    return y + cardHeight + 30;
  };

  // Helper function to add activity timeline table
  const addActivityTable = (y) => {
    // Table header
    doc.fontSize(16)
       .fill(colors.secondary)
       .text('Activity Timeline', 50, y);

    y += 30;

    // Table header background
    doc.rect(50, y, 495, 25)
       .fill(colors.primary);

    // Table headers
    doc.fontSize(10)
       .fill(colors.white)
       .text('Title', 60, y + 8)
       .text('Category', 200, y + 8)
       .text('Date', 320, y + 8)
       .text('Points', 420, y + 8)
       .text('Status', 480, y + 8);

    y += 25;

    // Table rows
    certificates.forEach((cert, index) => {
      const rowY = y + (index * 25);
      const isEven = index % 2 === 0;

      // Alternating row colors
      if (isEven) {
        doc.rect(50, rowY, 495, 25)
           .fill(colors.lightGray);
      }

      // Row data
      doc.fontSize(8)
         .fill(colors.text)
         .text(cert.title.substring(0, 25) + (cert.title.length > 25 ? '...' : ''), 60, rowY + 8)
         .text(cert.category, 200, rowY + 8)
         .text(new Date(cert.createdAt).toLocaleDateString(), 320, rowY + 8)
         .text(cert.points.toString(), 420, rowY + 8);

      // Status badge
      doc.rect(480, rowY + 5, 50, 15)
         .fill(colors.accent);
      
      doc.fontSize(7)
         .fill(colors.white)
         .text('Verified', 485, rowY + 9);
    });

    return y + (certificates.length * 25) + 30;
  };

  // Helper function to add footer with QR code
  const addFooter = async () => {
    const footerY = doc.page.height - 100;
    
    // Footer background
    doc.rect(0, footerY, doc.page.width, 100)
       .fill(colors.lightGray);

    // Generate QR code for profile link
    const profileUrl = `http://localhost:5173/profile/${studentId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(profileUrl, {
      width: 80,
      margin: 1,
      color: {
        dark: colors.secondary,
        light: colors.white
      }
    });

    // Convert base64 to buffer
    const qrBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
    doc.image(qrBuffer, 460, footerY + 10, { width: 80 });

    // Footer text
    doc.fontSize(10)
       .fill(colors.secondary)
       .text('Generated by Smart Student Hub', 50, footerY + 20);

    doc.fontSize(8)
       .fill(colors.text)
       .text(`Generated on: ${new Date().toLocaleDateString()}`, 50, footerY + 35)
       .text('This document contains verified achievements only.', 50, footerY + 50)
       .text('Scan QR code to view online profile →', 50, footerY + 65);

    // Watermark
    doc.fontSize(40)
       .fill('#00000010')
       .text('VERIFIED', 200, footerY - 200, {
         rotate: -45,
         opacity: 0.1
       });
  };

  // Build PDF content
  addHeader();
  
  let currentY = 150;
  currentY = addSummaryCards(currentY);
  
  if (certificates.length > 0) {
    currentY = addActivityTable(currentY);
  } else {
    doc.fontSize(12)
       .fill(colors.text)
       .text('No verified achievements found.', 50, currentY);
  }

  await addFooter();

  // Finalize PDF
  doc.end();
});

export { generatePortfolioPDF };
