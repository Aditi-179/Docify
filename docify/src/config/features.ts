import { FeatureConfig, FeatureMode } from '@/types';

export const FEATURES: Record<FeatureMode, FeatureConfig> = {
  'prompt-to-doc': {
    id: 'prompt-to-doc',
    title: 'Prompt to Doc',
    description: 'Transform your ideas into structured documents with AI research',
    icon: 'Sparkles',
    placeholder: 'Describe what you want to create...\n\nExamples:\n• "A comprehensive guide to sustainable investing for beginners"\n• "Technical documentation for a REST API authentication system"\n• "Marketing strategy for launching a new mobile app"',
    helperText: 'Our AI will research your topic and generate a well-structured document',
  },
  'text-to-doc': {
    id: 'text-to-doc',
    title: 'Text to Doc',
    description: 'Convert messy notes into polished, organized documents',
    icon: 'FileText',
    placeholder: 'Paste your unstructured text here...\n\nThis could be:\n• Meeting notes\n• Brain dump ideas\n• Rough drafts\n• Scattered thoughts',
    helperText: 'We\'ll organize and structure your content into a clean document',
  },
  'doc-to-doc': {
    id: 'doc-to-doc',
    title: 'Doc to Doc',
    description: 'Extract insights and summaries from uploaded documents',
    icon: 'FileUp',
    helperText: 'Upload a PDF, Markdown, or text file to extract and restructure its content',
  },
  'reformatter': {
    id: 'reformatter',
    title: 'Reformatter',
    description: 'Strictly reformat content using a template document',
    icon: 'Columns',
    helperText: 'Content will be reformatted exactly to match your template structure. No content will be added or removed.',
  },
};

export const FEATURE_ORDER: FeatureMode[] = [
  'prompt-to-doc',
  'text-to-doc', 
  'doc-to-doc',
  'reformatter',
];
