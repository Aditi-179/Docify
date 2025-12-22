import { motion } from 'framer-motion';
import { Wand2 } from 'lucide-react';
import { FEATURES } from '@/config/features';
import { useDocumentStore } from '@/store/documentStore';

export const TextToDocInput = () => {
  const { input, updateInput } = useDocumentStore();
  const feature = FEATURES['text-to-doc'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label className="section-label">Your unstructured text</label>
        <textarea
          value={input.rawText || ''}
          onChange={(e) => updateInput({ rawText: e.target.value })}
          placeholder={feature.placeholder}
          rows={10}
          className="input-field min-h-[250px] resize-none text-base leading-relaxed"
        />
      </div>

      <div className="flex items-start gap-3 rounded-xl bg-secondary/50 p-4">
        <Wand2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
        <p className="text-sm text-muted-foreground">
          {feature.helperText}
        </p>
      </div>

      {/* Character count */}
      <div className="flex justify-end">
        <span className="text-xs text-muted-foreground">
          {(input.rawText || '').length.toLocaleString()} characters
        </span>
      </div>
    </motion.div>
  );
};
