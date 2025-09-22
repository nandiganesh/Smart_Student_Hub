import { Router } from 'express';
import { 
  createCertificate, 
  getUserCertificates, 
  getAllCertificates, 
  updateCertificateStatus 
} from '../controllers/certificate.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

// Protected routes - require authentication
router.use(verifyJWT);

// Create certificate (upload)
router.post('/upload', upload.single('image'), createCertificate);

// Get user's certificates
router.get('/my-certificates', getUserCertificates);

// Get all certificates (admin/faculty only)
router.get('/all', getAllCertificates);

// Update certificate status (admin/faculty only)
router.put('/:certificateId', updateCertificateStatus);

// Delete certificate (students can delete their own pending/rejected certificates)
router.delete('/:certificateId', async (req, res) => {
  try {
    const { Certificate } = await import('../models/certificate.model.js');
    const { certificateId } = req.params;
    const userId = req.user._id;

    // Find certificate and verify ownership
    const certificate = await Certificate.findOne({ _id: certificateId, userId });
    
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found or you do not have permission to delete it'
      });
    }

    // Only allow deletion of pending or rejected certificates
    if (certificate.status === 'Verified') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete verified certificates'
      });
    }

    await Certificate.findByIdAndDelete(certificateId);

    res.json({
      success: true,
      message: 'Certificate deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

export default router;
