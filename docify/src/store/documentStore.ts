import { create } from 'zustand';
import { FeatureMode, DocumentInput, GeneratedDocument, EditorSettings } from '@/types';

interface DocumentState {
  activeMode: FeatureMode;
  input: DocumentInput;
  generatedDocument: GeneratedDocument | null;
  isGenerating: boolean;
  editorSettings: EditorSettings;
  setActiveMode: (mode: FeatureMode) => void;
  updateInput: (updates: Partial<DocumentInput>) => void;
  setGeneratedDocument: (doc: GeneratedDocument | null) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  updateEditorSettings: (settings: Partial<EditorSettings>) => void;
  resetInput: () => void;
}

const initialInput: DocumentInput = {
  mode: 'prompt-to-doc',
  promptText: '',
  rawText: '',
  uploadedFile: null,
  sourceFile: null,
  formatFile: null,
};

const initialEditorSettings: EditorSettings = {
  fontFamily: 'Plus Jakarta Sans',
  fontSize: 16,
  pageCount: 1,
};

export const useDocumentStore = create<DocumentState>((set) => ({
  activeMode: 'prompt-to-doc',
  input: initialInput,
  generatedDocument: null,
  isGenerating: false,
  editorSettings: initialEditorSettings,
  
  setActiveMode: (mode) => set((state) => ({ 
    activeMode: mode,
    input: { ...initialInput, mode }
  })),
  
  updateInput: (updates) => set((state) => ({
    input: { ...state.input, ...updates }
  })),
  
  setGeneratedDocument: (doc) => set({ generatedDocument: doc }),
  
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  
  updateEditorSettings: (settings) => set((state) => ({
    editorSettings: { ...state.editorSettings, ...settings }
  })),
  
  resetInput: () => set((state) => ({
    input: { ...initialInput, mode: state.activeMode }
  })),
}));
