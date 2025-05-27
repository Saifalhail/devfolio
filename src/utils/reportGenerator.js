export const generateProjectSummaryPDF = async (project = {}, t = (key, def) => def) => {
  // Attempt to dynamically import jsPDF if available
  let jsPDF;
  try {
    const mod = await import('jspdf');
    jsPDF = mod.jsPDF;
  } catch (e) {
    console.warn('jsPDF library not found, falling back to plain text PDF.');
  }

  const title = t('invoicing.projectSummaryTitle', 'Your Software Project Summary');
  const lines = [
    title,
    `Project: ${project.name || ''}`,
    `Client: ${project.client || ''}`,
    `Status: ${project.status || ''}`,
    '',
    project.description || ''
  ];

  if (jsPDF) {
    const doc = new jsPDF();
    doc.text(lines.join('\n'), 10, 10);
    doc.save('project-summary.pdf');
    return;
  }

  // Fallback: create a simple text-based PDF
  const blob = new Blob([lines.join('\n')], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'project-summary.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// This utility can be reused by other invoicing components to export
// different types of project reports in the future.
export default generateProjectSummaryPDF;
