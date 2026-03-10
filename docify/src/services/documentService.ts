import { FeatureMode, DocumentInput, GeneratedDocument } from '@/types';
import { callApi } from './apiService';

// Builds the title from the first document's topic returned by the API
const buildTitle = (topic: string, input: DocumentInput): string => {
  if (topic && topic !== 'undefined') return topic;
  switch (input.mode) {
    case 'prompt-to-doc':
      return (input.promptText?.slice(0, 60) || 'Generated Document') + (input.promptText && input.promptText.length > 60 ? '...' : '');
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

// Real API-backed document generation — replaces the old mock implementation
export const generateDocument = async (input: DocumentInput): Promise<GeneratedDocument> => {
  // Map DocumentInput fields to apiService params
  const { mode } = input;

  let textInput: string | undefined;
  let contentFile: File | null | undefined;
  let themeFile: File | null | undefined;

  switch (mode) {
    case 'prompt-to-doc':
      textInput = input.promptText;
      break;
    case 'text-to-doc':
      textInput = input.rawText;
      break;
    case 'doc-to-doc':
      contentFile = input.uploadedFile;
      break;
    case 'reformatter':
      contentFile = input.sourceFile;  // source content → contentFile
      themeFile = input.formatFile;    // format template → themeFile
      break;
  }

  const result = await callApi({ mode, textInput, contentFile, themeFile });

  // Reformatter downloads a .docx and signals completion
  if (result === 'file_download') {
    return {
      title: 'Document Downloaded',
      content: `<p>Your reformatted document has been downloaded successfully as a <strong>.docx</strong> file.</p>
<p>Check your browser's download folder to find your file.</p>`,
      sections: [],
      createdAt: new Date(),
    };
  }

  // For simple modes: the API returns an array of { topic, content } objects.
  // Combine all documents if multiple topics were returned, or use the first.
  if (!result || result.length === 0) {
    throw new Error('The server returned no documents. Please try again.');
  }

  // For single docs, use content directly (title is shown separately in the editor header).
  // For multiple topics, separate them with visible topic headings.
  const combinedContent = result.length === 1
    ? result[0].content
    : result.map(doc => `<h2>${doc.topic}</h2>\n${doc.content}`).join('\n\n<hr />\n\n');

  const title = buildTitle(result[0].topic, input);

  return {
    title,
    content: combinedContent,
    sections: result.map((doc, i) => ({
      id: String(i + 1),
      heading: doc.topic,
      content: doc.content,
      level: 1,
    })),
    createdAt: new Date(),
  };
};

// Service configuration by feature type (kept for backwards compatibility)
export const SERVICE_CONFIG = {
  'prompt-to-doc': {
    endpoint: '/api/generate',
    promptKey: 'Prompt-to-Doc',
  },
  'text-to-doc': {
    endpoint: '/api/generate',
    promptKey: 'Text-to-Doc',
  },
  'doc-to-doc': {
    endpoint: '/api/generate',
    promptKey: 'Doc-to-Doc',
  },
  'reformatter': {
    endpoint: '/api/generate/reformatter',
    promptKey: 'reformatter',
  },
};
