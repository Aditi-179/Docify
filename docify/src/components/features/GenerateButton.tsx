import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { useDocumentStore } from '@/store/documentStore';
import { generateDocument } from '@/services/documentService';

export const GenerateButton = () => {
  const { 
    activeMode, 
    input, 
    isGenerating, 
    setIsGenerating,
    setGeneratedDocument 
  } = useDocumentStore();

  const isInputValid = () => {
    switch (activeMode) {
      case 'prompt-to-doc':
        return (input.promptText?.trim().length || 0) > 10;
      case 'text-to-doc':
        return (input.rawText?.trim().length || 0) > 20;
      case 'doc-to-doc':
        return !!input.uploadedFile;
      case 'reformatter':
        return !!input.sourceFile && !!input.formatFile;
      default:
        return false;
    }
  };

  const handleGenerate = async () => {
    if (!isInputValid() || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const document = await generateDocument(input);
      setGeneratedDocument(document);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const valid = isInputValid();

  return (
    <motion.button
      onClick={handleGenerate}
      disabled={!valid || isGenerating}
      whileHover={valid && !isGenerating ? { scale: 1.02 } : {}}
      whileTap={valid && !isGenerating ? { scale: 0.98 } : {}}
      className={`
        btn-primary w-full py-5 text-lg
        ${!valid || isGenerating ? 'cursor-not-allowed opacity-60' : ''}
      `}
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Generating your document...</span>
        </>
      ) : (
        <>
          <Sparkles className="h-5 w-5" />
          <span>Generate Document</span>
        </>
      )}
    </motion.button>
  );
};
