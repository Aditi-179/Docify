import { motion } from 'framer-motion';
import { Upload, File, X, FileText, FileCode } from 'lucide-react';
import { useCallback, useState } from 'react';
import { FEATURES } from '@/config/features';
import { useDocumentStore } from '@/store/documentStore';

export const DocToDocInput = () => {
  const { input, updateInput } = useDocumentStore();
  const feature = FEATURES['doc-to-doc'];
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      updateInput({ uploadedFile: file });
    }
  }, [updateInput]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateInput({ uploadedFile: file });
    }
  }, [updateInput]);

  const removeFile = useCallback(() => {
    updateInput({ uploadedFile: null });
  }, [updateInput]);

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.pdf')) return FileText;
    if (fileName.endsWith('.md')) return FileCode;
    return File;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label className="section-label">Upload your document</label>
        
        {!input.uploadedFile ? (
          <label
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed transition-all duration-300
              ${isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50 hover:bg-secondary/30'
              }
            `}
          >
            <input
              type="file"
              accept=".pdf,.md,.txt,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <motion.div
              animate={{ y: isDragging ? -5 : 0 }}
              className={`
                flex h-16 w-16 items-center justify-center rounded-2xl transition-colors
                ${isDragging ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}
              `}
            >
              <Upload className="h-8 w-8" />
            </motion.div>
            
            <div className="text-center">
              <p className="font-medium text-foreground">
                {isDragging ? 'Drop your file here' : 'Drag & drop your document'}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                or click to browse • PDF, Markdown, TXT supported
              </p>
            </div>
          </label>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
          >
            {(() => {
              const FileIcon = getFileIcon(input.uploadedFile.name);
              return (
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <FileIcon className="h-7 w-7 text-primary" />
                </div>
              );
            })()}
            
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium text-foreground">
                {input.uploadedFile.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {(input.uploadedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            
            <button
              onClick={removeFile}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </div>

      <div className="flex items-start gap-3 rounded-xl bg-secondary/50 p-4">
        <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
        <p className="text-sm text-muted-foreground">
          {feature.helperText}
        </p>
      </div>
    </motion.div>
  );
};
