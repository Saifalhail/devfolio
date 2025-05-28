import { generateProjectSummaryPDF } from '../utils/reportGenerator';

jest.mock('jspdf', () => ({ jsPDF: function() { return { text: jest.fn(), save: jest.fn() }; } }), { virtual: true });

describe('generateProjectSummaryPDF', () => {
  test('creates a downloadable PDF link when jsPDF is unavailable', async () => {
    jest.resetModules();
    const { generateProjectSummaryPDF } = await import('../utils/reportGenerator');
    const createSpy = jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:');
    await generateProjectSummaryPDF({ name: 'Proj', client: 'Client', status: 'Done', description: 'desc' }, (k,d) => d);
    expect(createSpy).toHaveBeenCalled();
    createSpy.mockRestore();
  });
});
