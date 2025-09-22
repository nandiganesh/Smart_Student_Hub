import { saveAs } from 'file-saver';

const API_BASE_URL = 'http://localhost:8000';

export const downloadPortfolio = async (studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/portfolio/download/${studentId}`, {
      method: 'GET',
      credentials: 'include', // Include cookies for authentication
      headers: {
        'Accept': 'application/pdf',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const filename = `Portfolio_${new Date().toISOString().split('T')[0]}.pdf`;
    saveAs(blob, filename);
    
    return { success: true, message: 'Portfolio downloaded successfully!' };
  } catch (error) {
    console.error('Error downloading portfolio:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to download portfolio. Please try again.' 
    };
  }
};
