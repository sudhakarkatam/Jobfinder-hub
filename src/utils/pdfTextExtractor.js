// Temporary simplified version - PDF libraries will be installed later
// This allows the feature to work immediately for testing

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
};

/**
 * TEMPORARY: Mock text extraction until PDF libraries are installed
 * This simulates resume text extraction for testing
 */
export async function extractTextFromResume(file) {
  // For now, return a helpful message
  // Once you install pdfjs-dist and mammoth, this will be replaced with real extraction
  throw new Error(
    'PDF parsing libraries not yet installed. Please use manual skill entry mode or install dependencies: npm install pdfjs-dist mammoth'
  );
}

/**
 * Get file type info
 * @param {File} file - File to check
 * @returns {Object} File type information
 */
export function getFileInfo(file) {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    sizeInMB: (file.size / (1024 * 1024)).toFixed(2),
    isValid: !!ALLOWED_TYPES[file.type] && file.size <= MAX_FILE_SIZE,
    fileType: ALLOWED_TYPES[file.type] || 'unknown'
  };
}

