import { AnimatePresence } from 'framer-motion';
import { useDocumentStore } from '@/store/documentStore';
import { PromptToDocInput } from './PromptToDocInput';
import { TextToDocInput } from './TextToDocInput';
import { DocToDocInput } from './DocToDocInput';
import { ReformatterInput } from './ReformatterInput';

export const InputPanel = () => {
  const { activeMode } = useDocumentStore();

  const renderInput = () => {
    switch (activeMode) {
      case 'prompt-to-doc':
        return <PromptToDocInput key="prompt" />;
      case 'text-to-doc':
        return <TextToDocInput key="text" />;
      case 'doc-to-doc':
        return <DocToDocInput key="doc" />;
      case 'reformatter':
        return <ReformatterInput key="reformat" />;
      default:
        return null;
    }
  };

  return (
    <div className="elevated-card rounded-3xl p-6 sm:p-8">
      <AnimatePresence mode="wait">
        {renderInput()}
      </AnimatePresence>
    </div>
  );
};
