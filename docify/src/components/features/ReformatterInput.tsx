import { motion } from 'framer-motion';
import { Upload, File, X, AlertTriangle, FileText, FileCode, ArrowRight } from 'lucide-react';
import { useCallback, useState } from 'react';
import { FEATURES } from '@/config/features';
import { useDocumentStore } from '@/store/documentStore';

type FileType = 'source' | 'format';

export const ReformatterInput = () => {
  const { input, updateInput } = useDocumentStore();
  const feature = FEATURES['reformatter'];
  const [draggingOver, setDraggingOver] = useState<FileType | null>(null);

  const handleDrop = useCallback((e: React.DragEvent, type: FileType) => {
    e.preventDefault();
    setDraggingOver(null);
    const file = e.dataTransfer.files[0];
    if (file) {
      updateInput({ [type === 'source' ? 'sourceFile' : 'formatFile']: file });
    }
  }, [updateInput]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: FileType) => {
    const file = e.target.files?.[0];
    if (file) {
      updateInput({ [type === 'source' ? 'sourceFile' : 'formatFile']: file });
    }
  }, [updateInput]);

  const removeFile = useCallback((type: FileType) => {
    updateInput({ [type === 'source' ? 'sourceFile' : 'formatFile']: null });
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
      className="space-y-6"
    >
      {/* Warning banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-start gap-3 rounded-xl border border-accent/30 bg-accent/10 p-4"
      >
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
        <div>
          <p className="font-medium text-foreground">Strict Formatting Mode</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Content will be reformatted exactly to match the template structure. 
            <strong className="text-foreground"> No content will be added or removed.</strong>
          </p>
        </div>
      </motion.div>

      {/* Two file upload panels */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Source file */}
        <FileUploadPanel
          label="Source Content"
          description="The content you want to reformat"
          file={input.sourceFile}
          type="source"
          isDragging={draggingOver === 'source'}
          onDragOver={(e) => { e.preventDefault(); setDraggingOver('source'); }}
          onDragLeave={() => setDraggingOver(null)}
          onDrop={(e) => handleDrop(e, 'source')}
          onFileSelect={(e) => handleFileSelect(e, 'source')}
          onRemove={() => removeFile('source')}
          getFileIcon={getFileIcon}
        />

        {/* Arrow indicator */}
        <div className="hidden items-center justify-center lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="rounded-full bg-primary/10 p-3">
            <ArrowRight className="h-5 w-5 text-primary" />
          </div>
        </div>

        {/* Format template */}
        <FileUploadPanel
          label="Format Template"
          description="The structure to apply to your content"
          file={input.formatFile}
          type="format"
          isDragging={draggingOver === 'format'}
          onDragOver={(e) => { e.preventDefault(); setDraggingOver('format'); }}
          onDragLeave={() => setDraggingOver(null)}
          onDrop={(e) => handleDrop(e, 'format')}
          onFileSelect={(e) => handleFileSelect(e, 'format')}
          onRemove={() => removeFile('format')}
          getFileIcon={getFileIcon}
        />
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

interface FileUploadPanelProps {
  label: string;
  description: string;
  file: File | null | undefined;
  type: FileType;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  getFileIcon: (fileName: string) => React.ComponentType<{ className?: string }>;
}

const FileUploadPanel = ({
  label,
  description,
  file,
  type,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onRemove,
  getFileIcon,
}: FileUploadPanelProps) => (
  <div className="space-y-2">
    <div className="flex items-baseline justify-between">
      <label className="section-label">{label}</label>
      <span className="text-xs text-muted-foreground">{description}</span>
    </div>
    
    {!file ? (
      <label
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`
          flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed transition-all duration-300
          ${isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50 hover:bg-secondary/30'
          }
        `}
      >
        <input
          type="file"
          accept=".pdf,.md,.txt,.doc,.docx"
          onChange={onFileSelect}
          className="hidden"
        />
        
        <motion.div
          animate={{ y: isDragging ? -3 : 0 }}
          className={`
            flex h-12 w-12 items-center justify-center rounded-xl transition-colors
            ${isDragging ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}
          `}
        >
          <Upload className="h-6 w-6" />
        </motion.div>
        
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            {isDragging ? 'Drop here' : 'Drop file or click'}
          </p>
        </div>
      </label>
    ) : (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
      >
        {(() => {
          const FileIcon = getFileIcon(file.name);
          return (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <FileIcon className="h-6 w-6 text-primary" />
            </div>
          );
        })()}
        
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {file.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {(file.size / 1024).toFixed(1)} KB
          </p>
        </div>
        
        <button
          onClick={onRemove}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    )}
  </div>
);
