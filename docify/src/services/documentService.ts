import { FeatureMode, DocumentInput, GeneratedDocument, DocumentSection } from '@/types';

// Simulated API delay
const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock document generation - replace with actual API calls
export const generateDocument = async (input: DocumentInput): Promise<GeneratedDocument> => {
  await simulateDelay(2000 + Math.random() * 1000);
  
  const mockSections = getMockSections(input.mode);
  
  return {
    title: getDocumentTitle(input),
    content: mockSections.map(s => `## ${s.heading}\n\n${s.content}`).join('\n\n'),
    sections: mockSections,
    createdAt: new Date(),
  };
};

const getDocumentTitle = (input: DocumentInput): string => {
  switch (input.mode) {
    case 'prompt-to-doc':
      return input.promptText?.slice(0, 50) + '...' || 'Generated Document';
    case 'text-to-doc':
      return 'Structured Document';
    case 'doc-to-doc':
      return input.uploadedFile?.name?.replace(/\.[^/.]+$/, '') || 'Extracted Document';
    case 'reformatter':
      return 'Reformatted Document';
    default:
      return 'New Document';
  }
};

const getMockSections = (mode: FeatureMode): DocumentSection[] => {
  const baseSections: DocumentSection[] = [
    {
      id: '1',
      heading: 'Executive Summary',
      content: 'This document provides a comprehensive overview of the requested topic, synthesizing key information and insights to deliver actionable recommendations.',
      level: 1,
    },
    {
      id: '2', 
      heading: 'Introduction',
      content: 'Understanding the context and background is essential for grasping the full scope of this analysis. The following sections delve into the core components and their interconnections.',
      level: 1,
    },
    {
      id: '3',
      heading: 'Key Findings',
      content: 'Our research reveals several critical insights:\n\n• Primary insight with supporting evidence\n• Secondary findings that complement the main thesis\n• Emerging patterns that warrant further investigation',
      level: 1,
    },
    {
      id: '4',
      heading: 'Detailed Analysis',
      content: 'A thorough examination of the subject matter reveals nuanced perspectives. The data suggests multiple pathways forward, each with distinct advantages and considerations.',
      level: 1,
    },
    {
      id: '5',
      heading: 'Recommendations',
      content: 'Based on the analysis presented, we recommend the following strategic actions:\n\n1. Immediate priorities for implementation\n2. Medium-term initiatives for sustainable growth\n3. Long-term vision alignment strategies',
      level: 1,
    },
    {
      id: '6',
      heading: 'Conclusion',
      content: 'This document has outlined the key aspects of the topic, providing a foundation for informed decision-making. The insights presented here should serve as a starting point for deeper exploration.',
      level: 1,
    },
  ];

  return baseSections;
};

// Service configuration by feature type
export const SERVICE_CONFIG = {
  'prompt-to-doc': {
    endpoint: '/api/generate/prompt',
    promptKey: 'PROMPT_TO_DOC',
  },
  'text-to-doc': {
    endpoint: '/api/generate/text',
    promptKey: 'TEXT_TO_DOC',
  },
  'doc-to-doc': {
    endpoint: '/api/generate/document',
    promptKey: 'DOC_TO_DOC',
  },
  'reformatter': {
    endpoint: '/api/generate/reformat',
    promptKey: 'REFORMATTER',
  },
};
