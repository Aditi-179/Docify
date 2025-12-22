export type FeatureMode = 'prompt-to-doc' | 'text-to-doc' | 'doc-to-doc' | 'reformatter';

export interface FeatureConfig {
  id: FeatureMode;
  title: string;
  description: string;
  icon: string;
  placeholder?: string;
  helperText?: string;
}

export interface DocumentInput {
  mode: FeatureMode;
  promptText?: string;
  rawText?: string;
  uploadedFile?: File | null;
  sourceFile?: File | null;
  formatFile?: File | null;
}

export interface GeneratedDocument {
  title: string;
  content: string;
  sections: DocumentSection[];
  createdAt: Date;
}

export interface DocumentSection {
  id: string;
  heading: string;
  content: string;
  level: number;
}

export interface EditorSettings {
  fontFamily: string;
  fontSize: number;
  pageCount: number;
}

export const FONT_FAMILIES = [
  { value: 'Plus Jakarta Sans', label: 'Sans (Default)' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Courier New', label: 'Courier New' },
] as const;

export const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32] as const;
