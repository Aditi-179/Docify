import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Copy, Download, Check, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useDocumentStore } from '@/store/documentStore';

export const DocumentPreview = () => {
  const { generatedDocument, setGeneratedDocument, isGenerating } = useDocumentStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!generatedDocument) return;
    await navigator.clipboard.writeText(generatedDocument.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setGeneratedDocument(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="elevated-card flex h-full min-h-[400px] flex-col rounded-3xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Preview</h3>
            <p className="text-xs text-muted-foreground">
              {generatedDocument ? 'Document ready' : 'Waiting for input'}
            </p>
          </div>
        </div>
        
        {generatedDocument && (
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Download className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
            </motion.button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <LoadingState key="loading" />
          ) : generatedDocument ? (
            <DocumentContent key="content" document={generatedDocument} />
          ) : (
            <EmptyState key="empty" />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex h-full flex-col items-center justify-center text-center"
  >
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
      <FileText className="h-8 w-8 text-muted-foreground" />
    </div>
    <h4 className="mb-2 font-semibold text-foreground">No document yet</h4>
    <p className="max-w-[240px] text-sm text-muted-foreground">
      Choose a workflow and provide your input to generate a beautifully structured document
    </p>
  </motion.div>
);

const LoadingState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex h-full flex-col items-center justify-center"
  >
    <div className="space-y-4 w-full max-w-md">
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="space-y-2"
        >
          <div 
            className="h-4 rounded-full bg-gradient-to-r from-secondary via-muted to-secondary animate-shimmer"
            style={{ 
              width: `${60 + Math.random() * 30}%`,
              backgroundSize: '200% 100%'
            }} 
          />
          <div 
            className="h-3 rounded-full bg-gradient-to-r from-secondary via-muted to-secondary animate-shimmer"
            style={{ 
              width: `${40 + Math.random() * 40}%`,
              backgroundSize: '200% 100%',
              animationDelay: '0.1s'
            }} 
          />
        </motion.div>
      ))}
    </div>
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-8 text-sm text-muted-foreground"
    >
      Crafting your document...
    </motion.p>
  </motion.div>
);

interface DocumentContentProps {
  document: {
    title: string;
    sections: Array<{
      id: string;
      heading: string;
      content: string;
      level: number;
    }>;
    createdAt: Date;
  };
}

const DocumentContent = ({ document }: DocumentContentProps) => (
  <motion.article
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="prose prose-slate max-w-none"
  >
    <motion.h1 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="mb-6 text-2xl font-bold text-foreground"
    >
      {document.title}
    </motion.h1>
    
    {document.sections.map((section, index) => (
      <motion.section
        key={section.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 + index * 0.05 }}
        className="mb-6"
      >
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          {section.heading}
        </h2>
        <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
          {section.content}
        </p>
      </motion.section>
    ))}

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-8 border-t border-border pt-4"
    >
      <p className="text-xs text-muted-foreground">
        Generated on {document.createdAt.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </p>
    </motion.div>
  </motion.article>
);
