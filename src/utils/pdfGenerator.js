import jsPDF from 'jspdf';

// Function to capture the exact HTML content from the preview
const capturePreviewContent = () => {
  // Find the resume preview element
  const previewElement = document.querySelector('[data-testid="resume-preview"]') || 
                        document.querySelector('.resume-preview') ||
                        document.querySelector('.bg-white.border');
  
  if (!previewElement) {
    console.error('Resume preview element not found');
    return null;
  }
  
  return previewElement;
};

// Function to convert HTML to canvas and then to PDF
const htmlToCanvas = (element) => {
  return new Promise((resolve, reject) => {
    try {
      // Use html2canvas to capture the element
      import('html2canvas').then(({ default: html2canvas }) => {
        html2canvas(element, {
          scale: 1.0, // Further reduced scale for single page fit
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: element.offsetWidth,
          height: element.offsetHeight,
          scrollX: 0,
          scrollY: 0,
          windowWidth: element.offsetWidth,
          windowHeight: element.offsetHeight,
          logging: false,
          removeContainer: true,
          foreignObjectRendering: false
        }).then(canvas => {
          resolve(canvas);
        }).catch(error => {
          reject(error);
        });
      }).catch(error => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Function to add canvas to PDF
const addCanvasToPDF = (doc, canvas, x, y, width, height) => {
  const imgData = canvas.toDataURL('image/png');
  doc.addImage(imgData, 'PNG', x, y, width, height);
};

export const generatePDF = async (resumeData, template = 'modern') => {
  try {
    // Wait a bit for the DOM to update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Capture the preview content
    const previewElement = capturePreviewContent();
    if (!previewElement) {
      throw new Error('Could not find resume preview element');
    }
    
    // Convert to canvas
    const canvas = await htmlToCanvas(previewElement);
    
    // Create PDF
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Calculate dimensions to fit the content on single page - AGGRESSIVE SCALING
    const canvasAspectRatio = canvas.width / canvas.height;
    const pageAspectRatio = pageWidth / pageHeight;
    
    let imgWidth, imgHeight;
    
    // Force fit to single page with minimal margins
    const maxWidth = pageWidth - 10; // 5mm margin on each side
    const maxHeight = pageHeight - 10; // 5mm margin on each side
    
    // Always fit by height first to ensure single page
    imgHeight = maxHeight;
    imgWidth = imgHeight * canvasAspectRatio;
    
    // If width exceeds page, scale down proportionally
    if (imgWidth > maxWidth) {
      imgWidth = maxWidth;
      imgHeight = imgWidth / canvasAspectRatio;
    }
    
    // Additional safety check - if still too tall, force scale down
    if (imgHeight > maxHeight) {
      const scaleFactor = maxHeight / imgHeight;
      imgHeight = maxHeight;
      imgWidth = imgWidth * scaleFactor;
    }
    
    // Center the image on the page
    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;
    
    // Add the canvas to PDF
    addCanvasToPDF(doc, canvas, x, y, imgWidth, imgHeight);
    
    return doc;
  } catch (error) {
    console.error('PDF generation failed:', error);
    // Fallback to manual PDF generation
    return generateManualPDF(resumeData, template);
  }
};

// Fallback manual PDF generation
const generateManualPDF = (resumeData, template = 'modern') => {
  const doc = new jsPDF();
  
  // Set margins and page dimensions - Back to good format
  const margin = 15; // Back to good margin
  const pageWidth = 210;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Template-specific styling - Back to good format with proper scaling
  const getTemplateStyles = () => {
    switch (template) {
      case 'modern':
        return {
          nameFontSize: 20, // Back to good size
          titleFontSize: 12, // Back to good size
          sectionFontSize: 14, // Back to good size
          bodyFontSize: 9, // Back to good size
          skillCategoryFontSize: 10, // Back to good size
          skillTagFontSize: 8, // Back to good size
          accentColor: [59, 130, 246],
          skillTagColor: [219, 234, 254],
          skillBorderColor: [147, 197, 253],
          skillTextColor: [30, 64, 175]
        };
      case 'classic':
        return {
          nameFontSize: 18, // Back to good size
          titleFontSize: 11, // Back to good size
          sectionFontSize: 12, // Back to good size
          bodyFontSize: 9, // Back to good size
          skillCategoryFontSize: 10, // Back to good size
          skillTagFontSize: 8, // Back to good size
          accentColor: [0, 0, 0],
          skillTagColor: [240, 240, 240],
          skillBorderColor: [128, 128, 128],
          skillTextColor: [0, 0, 0]
        };
      case 'creative':
        return {
          nameFontSize: 20, // Back to good size
          titleFontSize: 12, // Back to good size
          sectionFontSize: 14, // Back to good size
          bodyFontSize: 9, // Back to good size
          skillCategoryFontSize: 10, // Back to good size
          skillTagFontSize: 8, // Back to good size
          accentColor: [147, 51, 234],
          skillTagColor: [237, 233, 254],
          skillBorderColor: [196, 181, 253],
          skillTextColor: [88, 28, 135]
        };
      case 'minimal':
        return {
          nameFontSize: 18, // Back to good size
          titleFontSize: 11, // Back to good size
          sectionFontSize: 12, // Back to good size
          bodyFontSize: 9, // Back to good size
          skillCategoryFontSize: 10, // Back to good size
          skillTagFontSize: 8, // Back to good size
          accentColor: [107, 114, 128],
          skillTagColor: [249, 250, 251],
          skillBorderColor: [209, 213, 219],
          skillTextColor: [55, 65, 81]
        };
      default:
        return {
          nameFontSize: 20, // Back to good size
          titleFontSize: 12, // Back to good size
          sectionFontSize: 14, // Back to good size
          bodyFontSize: 9, // Back to good size
          skillCategoryFontSize: 10, // Back to good size
          skillTagFontSize: 8, // Back to good size
          accentColor: [59, 130, 246],
          skillTagColor: [219, 234, 254],
          skillBorderColor: [147, 197, 253],
          skillTextColor: [30, 64, 175]
        };
    }
  };

  const styles = getTemplateStyles();

  // Helper function to check if we need a new page - Optimized for single page
  const checkPageBreak = (requiredSpace = 8) => {
    if (yPosition + requiredSpace > 285) { // Increased from 280
      // For single page resumes, try to compress instead of adding page
      if (requiredSpace > 20) {
        // Only add page if absolutely necessary
        doc.addPage();
        yPosition = margin;
        return true;
      }
      // Otherwise, try to fit by reducing spacing
      yPosition = 285 - requiredSpace;
    }
    return false;
  };

  // Helper function to draw section header - Back to good spacing
  const drawSectionHeader = (text) => {
    doc.setFontSize(styles.sectionFontSize);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, yPosition);
    yPosition += 6; // Back to good spacing
    
    // Draw underline
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, margin + contentWidth, yPosition);
    yPosition += 4; // Back to good spacing
  };

  // Helper function to draw skills tags on same line as category
  const drawSkillCategoryWithTags = (category, skills) => {
    if (!skills || skills.length === 0) return;
    
    // Draw category name
    doc.setFontSize(styles.skillCategoryFontSize);
    doc.setFont('helvetica', 'bold');
    doc.text(category + ':', margin, yPosition);
    
    // Calculate position for skills
    const categoryWidth = doc.getTextWidth(category + ':');
    const skillsStartX = margin + categoryWidth + 8; // 8px gap
    const maxWidth = contentWidth - categoryWidth - 8;
    
    // Draw skills tags on the same line
    const skillList = skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    
    if (skillList.length > 0) {
      let currentX = skillsStartX;
      let currentY = yPosition;
      const tagHeight = 6;
      const tagPadding = 4;
      
      skillList.forEach((skill, skillIndex) => {
        const skillText = skill.trim();
        if (!skillText) return;
        
        const textWidth = doc.getTextWidth(skillText);
        const tagWidth = textWidth + (tagPadding * 2);
        
        // Check if we need to wrap to next line
        if (currentX + tagWidth > skillsStartX + maxWidth) {
          currentX = skillsStartX;
          currentY += tagHeight + 2;
          checkPageBreak(tagHeight + 4);
        }
        
        // Draw tag background
        doc.setFillColor(styles.skillTagColor[0], styles.skillTagColor[1], styles.skillTagColor[2]);
        doc.rect(currentX, currentY - 3, tagWidth, tagHeight, 'F');
        
        // Draw tag border
        doc.setDrawColor(styles.skillBorderColor[0], styles.skillBorderColor[1], styles.skillBorderColor[2]);
        doc.rect(currentX, currentY - 3, tagWidth, tagHeight, 'S');
        
        // Draw tag text
        doc.setFontSize(styles.skillTagFontSize);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(styles.skillTextColor[0], styles.skillTextColor[1], styles.skillTextColor[2]);
        doc.text(skillText, currentX + tagPadding, currentY + 2);
        
        currentX += tagWidth + 4;
      });
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
      yPosition = currentY + tagHeight + 6;
    } else {
      yPosition += 8;
    }
  };

  // Header Section - Back to good spacing
  const fullName = `${resumeData.firstName || ''} ${resumeData.lastName || ''}`.trim();
  if (fullName) {
    doc.setFontSize(styles.nameFontSize);
    doc.setFont('helvetica', 'bold');
    doc.text(fullName.toUpperCase(), margin, yPosition);
    yPosition += 6; // Back to good spacing
  }

  if (resumeData.jobTitle) {
    doc.setFontSize(styles.titleFontSize);
    doc.setFont('helvetica', 'normal');
    doc.text(resumeData.jobTitle, margin, yPosition);
    yPosition += 4; // Back to good spacing
  }

  // Contact Information
  const contactInfo = [
    resumeData.email,
    resumeData.phone,
    resumeData.location
  ].filter(Boolean).join(' • ');
  
  if (contactInfo) {
    doc.setFontSize(styles.bodyFontSize);
    doc.setFont('helvetica', 'normal');
    doc.text(contactInfo, margin, yPosition);
    yPosition += 6;
  }

  // Online Profiles
  const profiles = [
    resumeData.linkedin && 'LinkedIn',
    resumeData.github && 'GitHub',
    resumeData.portfolio && 'Portfolio'
  ].filter(Boolean).join(' | ');
  
  if (profiles) {
    doc.setFontSize(styles.bodyFontSize);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(styles.accentColor[0], styles.accentColor[1], styles.accentColor[2]);
    doc.text(profiles, margin, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 12;
  }

  // Objective Section
  if (resumeData.objective) {
    drawSectionHeader('OBJECTIVE');
    doc.setFontSize(styles.bodyFontSize);
    doc.setFont('helvetica', 'normal');
    const objectiveLines = doc.splitTextToSize(resumeData.objective, contentWidth);
    doc.text(objectiveLines, margin, yPosition);
    yPosition += (objectiveLines.length * 4) + 8;
  }

  // Education Section
  if (resumeData.education && resumeData.education.length > 0) {
    checkPageBreak(15);
    drawSectionHeader('EDUCATION');
    
    resumeData.education.forEach((edu, index) => {
      checkPageBreak(20);
      
      // Degree and dates on same line
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(edu.degree, margin, yPosition);
      
      const dateText = `${edu.startDate} - ${edu.endDate}`;
      const dateWidth = doc.getTextWidth(dateText);
      doc.setFont('helvetica', 'normal');
      doc.text(dateText, margin + contentWidth - dateWidth, yPosition);
      yPosition += 5;
      
      // Institution and location
      doc.setFontSize(styles.bodyFontSize);
      const institutionText = `${edu.institution}, ${edu.location}`;
      doc.text(institutionText, margin, yPosition);
      yPosition += 4;
      
      // Grade
      if (edu.grade) {
        const gradeText = edu.grade.includes('%') ? `Percentage: ${edu.grade}` : `CGPA: ${edu.grade}`;
        doc.text(gradeText, margin, yPosition);
        yPosition += 4;
      }
      
      if (index < resumeData.education.length - 1) {
        yPosition += 3;
      }
    });
  }

  // Skills Section
  if (resumeData.skills && resumeData.skills.length > 0) {
    checkPageBreak(15);
    drawSectionHeader('SKILLS');
    
    resumeData.skills.forEach((skillGroup, index) => {
      checkPageBreak(15);
      
      if (skillGroup.category && skillGroup.skills) {
        drawSkillCategoryWithTags(skillGroup.category, skillGroup.skills);
      }
      
      if (index < resumeData.skills.length - 1) {
        yPosition += 2;
      }
    });
  }

  // Projects Section
  if (resumeData.projects && resumeData.projects.length > 0) {
    checkPageBreak(15);
    drawSectionHeader('PROJECTS');
    
    resumeData.projects.forEach((project, index) => {
      checkPageBreak(25);
      
      // Project title and link
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(project.title, margin, yPosition);
      
      if (project.link) {
        doc.setFontSize(styles.bodyFontSize);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(styles.accentColor[0], styles.accentColor[1], styles.accentColor[2]);
        doc.text('Link', margin + contentWidth - 15, yPosition);
        doc.setTextColor(0, 0, 0);
      }
      yPosition += 5;
      
      // Technologies
      if (project.technologies) {
        doc.setFontSize(styles.bodyFontSize);
        doc.setFont('helvetica', 'normal');
        doc.text(`Technologies: ${project.technologies}`, margin, yPosition);
        yPosition += 4;
      }
      
      // Description
      if (project.description) {
        const descLines = doc.splitTextToSize(project.description, contentWidth);
        doc.text(descLines, margin, yPosition);
        yPosition += (descLines.length * 4) + 4;
      }
      
      if (index < resumeData.projects.length - 1) {
        yPosition += 3;
      }
    });
  }

  // Experience Section
  if (resumeData.experience && resumeData.experience.length > 0) {
    checkPageBreak(15);
    drawSectionHeader('EXPERIENCE');
    
    resumeData.experience.forEach((exp, index) => {
      checkPageBreak(25);
      
      // Job title and dates
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(exp.title, margin, yPosition);
      
      const dateText = exp.endDate === 'Present' ? `${exp.startDate} - Present` : `${exp.startDate} - ${exp.endDate}`;
      const dateWidth = doc.getTextWidth(dateText);
      doc.setFont('helvetica', 'normal');
      doc.text(dateText, margin + contentWidth - dateWidth, yPosition);
      yPosition += 5;
      
      // Company and location
      doc.setFontSize(styles.bodyFontSize);
      const companyText = `${exp.company}, ${exp.location}`;
      doc.text(companyText, margin, yPosition);
      yPosition += 6;
      
      // Description
      if (exp.description) {
        const descLines = doc.splitTextToSize(exp.description, contentWidth);
        doc.text(descLines, margin, yPosition);
        yPosition += (descLines.length * 4) + 4;
      }
      
      if (index < resumeData.experience.length - 1) {
        yPosition += 3;
      }
    });
  }

  // Certifications Section
  if (resumeData.certifications && resumeData.certifications.length > 0) {
    checkPageBreak(15);
    drawSectionHeader('CERTIFICATIONS');
    
    resumeData.certifications.forEach((cert, index) => {
      checkPageBreak(8);
      doc.setFontSize(styles.bodyFontSize);
      doc.setFont('helvetica', 'normal');
      const certText = `${cert.title} - ${cert.organization} (${cert.date})`;
      const certLines = doc.splitTextToSize(certText, contentWidth);
      doc.text(certLines, margin, yPosition);
      yPosition += (certLines.length * 4) + 2;
    });
  }

  // Languages Section
  if (resumeData.languages && resumeData.languages.length > 0) {
    checkPageBreak(15);
    drawSectionHeader('LANGUAGES');
    
    const languagesText = resumeData.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(', ');
    doc.setFontSize(styles.bodyFontSize);
    doc.setFont('helvetica', 'normal');
    const langLines = doc.splitTextToSize(languagesText, contentWidth);
    doc.text(langLines, margin, yPosition);
    yPosition += (langLines.length * 4) + 8;
  }

  // Achievements Section
  if (resumeData.achievements && resumeData.achievements.length > 0) {
    checkPageBreak(15);
    drawSectionHeader('ACHIEVEMENTS');
    
    resumeData.achievements.forEach((achievement, index) => {
      checkPageBreak(20);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(achievement.title, margin, yPosition);
      yPosition += 4;
      
      doc.setFontSize(styles.bodyFontSize);
      doc.setFont('helvetica', 'normal');
      doc.text(`${achievement.organization} (${achievement.date})`, margin, yPosition);
      yPosition += 4;
      
      if (achievement.description) {
        const descLines = doc.splitTextToSize(achievement.description, contentWidth);
        doc.text(descLines, margin, yPosition);
        yPosition += (descLines.length * 4) + 4;
      }
      
      if (index < resumeData.achievements.length - 1) {
        yPosition += 3;
      }
    });
  }

  // Hackathons Section
  if (resumeData.hackathons && resumeData.hackathons.length > 0) {
    checkPageBreak(15);
    drawSectionHeader('HACKATHONS & COMPETITIONS');
    
    resumeData.hackathons.forEach((hackathon, index) => {
      checkPageBreak(20);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(hackathon.name, margin, yPosition);
      yPosition += 4;
      
      doc.setFontSize(styles.bodyFontSize);
      doc.setFont('helvetica', 'normal');
      doc.text(`${hackathon.organizer} (${hackathon.date})`, margin, yPosition);
      yPosition += 4;
      
      if (hackathon.result) {
        doc.text(hackathon.result, margin, yPosition);
        yPosition += 4;
      }
      
      if (index < resumeData.hackathons.length - 1) {
        yPosition += 3;
      }
    });
  }

  return doc;
};

export const downloadPDF = async (resumeData, filename = 'resume.pdf', template = 'modern') => {
  try {
    const doc = await generatePDF(resumeData, template);
    const fileName = filename || `${resumeData.firstName}_${resumeData.lastName}_Resume.pdf`;
    doc.save(fileName);
    return true;
  } catch (error) {
    console.error('PDF generation failed:', error);
    return false;
  }
}; 