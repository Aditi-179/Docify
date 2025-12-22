import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { FEATURES } from '@/config/features';
import { useDocumentStore } from '@/store/documentStore';

export const PromptToDocInput = () => {
  const { input, updateInput } = useDocumentStore();
  const feature = FEATURES['prompt-to-doc'];

  const examplePrompts = [
    "Write a beginner's guide to machine learning",
    "Create a product launch strategy document",
    "Develop a comprehensive onboarding manual",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label className="section-label">Your prompt</label>
        <textarea
          value={input.promptText || ''}
          onChange={(e) => updateInput({ promptText: e.target.value })}
          placeholder={feature.placeholder}
          rows={8}
          className="input-field min-h-[200px] resize-none text-base leading-relaxed"
        />
      </div>

      <div className="flex items-start gap-3 rounded-xl bg-secondary/50 p-4">
        <Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {feature.helperText}
          </p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => updateInput({ promptText: prompt })}
                className="rounded-lg bg-background px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-all hover:bg-primary hover:text-primary-foreground"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
