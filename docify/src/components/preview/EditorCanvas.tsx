import { motion } from 'framer-motion';
import { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Download, 
  Copy, 
  Share2, 
  MoreHorizontal,
  Type,
  Image,
  List,
  Quote,
  Heading1,
  Heading2,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  RefreshCw,
  Sparkles,
  ChevronDown,
  FileText,
  Minus,
  Plus
} from 'lucide-react';
import { useDocumentStore } from '@/store/documentStore';
import { FONT_FAMILIES, FONT_SIZES } from '@/types';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// A4 dimensions: 210mm × 297mm (approximately 794px × 1123px at 96 DPI)
const A4_HEIGHT_PX = 1123;

// Convert markdown-like content to HTML for display
const contentToHtml = (content: string): string => {
  return content
    .split('\n')
    .map(line => {
      if (line.startsWith('## ')) {
        return `<h2 class="mt-10 text-2xl font-bold text-slate-900 first:mt-0">${line.replace('## ', '')}</h2>`;
      }
      if (line.startsWith('### ')) {
        return `<h3 class="mt-8 text-xl font-semibold text-slate-800">${line.replace('### ', '')}</h3>`;
      }
      if (line.startsWith('- ')) {
        return `<li class="text-slate-600">${line.replace('- ', '')}</li>`;
      }
      if (line.trim() === '') {
        return '<div class="h-4"></div>';
      }
      return `<p class="text-slate-600 leading-relaxed">${line}</p>`;
    })
    .join('');
};

export const EditorCanvas = () => {
  const { 
    generatedDocument, 
    setGeneratedDocument, 
    resetInput,
    editorSettings,
    updateEditorSettings,
    activeMode
  } = useDocumentStore();
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const documentIdRef = useRef<string | null>(null);

  // Initialize content when document changes
  useEffect(() => {
    if (!generatedDocument) {
      documentIdRef.current = null;
      setIsInitialized(false);
      return;
    }

    const docId = generatedDocument.createdAt.toString();
    if (documentIdRef.current !== docId) {
      documentIdRef.current = docId;
      setIsInitialized(false);
      
      // Set content after a tick to ensure refs are ready
      requestAnimationFrame(() => {
        if (titleRef.current) {
          titleRef.current.innerText = generatedDocument.title;
        }
        if (contentRef.current) {
          contentRef.current.innerHTML = contentToHtml(generatedDocument.content);
        }
        setIsInitialized(true);
      });
    }
  }, [generatedDocument]);

  const handleTitleChange = useCallback(() => {
    if (!titleRef.current || !generatedDocument) return;
    const newTitle = titleRef.current.innerText.trim();
    if (newTitle !== generatedDocument.title) {
      setGeneratedDocument({
        ...generatedDocument,
        title: newTitle,
      });
      setLastSaved(new Date());
    }
  }, [generatedDocument, setGeneratedDocument]);

  const handleContentChange = useCallback(() => {
    if (!contentRef.current || !generatedDocument) return;
    
    const elements = contentRef.current.children;
    const newContentParts: string[] = [];
    
    Array.from(elements).forEach((el) => {
      const text = el.textContent?.trim() || '';
      if (!text) {
        newContentParts.push('');
        return;
      }
      
      if (el.tagName === 'H2') {
        newContentParts.push(`## ${text}`);
      } else if (el.tagName === 'H3') {
        newContentParts.push(`### ${text}`);
      } else if (el.tagName === 'LI') {
        newContentParts.push(`- ${text}`);
      } else if (el.tagName === 'DIV' && el.className.includes('h-4')) {
        newContentParts.push('');
      } else {
        newContentParts.push(text);
      }
    });
    
    const newContent = newContentParts.join('\n');
    if (newContent !== generatedDocument.content) {
      setGeneratedDocument({
        ...generatedDocument,
        content: newContent,
      });
      setLastSaved(new Date());
    }
  }, [generatedDocument, setGeneratedDocument]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
  };

  const handleRegenerateSelected = async () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    
    if (!selectedText) {
      toast.error('Please select some text to regenerate');
      return;
    }

    setIsRegenerating(true);
    toast.info('Regenerating selected content...');
    
    // Simulate AI regeneration (replace with actual API call)
    setTimeout(() => {
      const regeneratedText = `[Regenerated] ${selectedText}`;
      document.execCommand('insertText', false, regeneratedText);
      setIsRegenerating(false);
      toast.success('Content regenerated successfully');
      handleContentChange();
    }, 1500);
  };

  // Helper to get plain text content from a node, preserving structure but removing style spans
  const getTextContentPreservingStructure = (node: Node): DocumentFragment => {
    const fragment = document.createDocumentFragment();
    
    const processNode = (n: Node, parent: Node) => {
      if (n.nodeType === Node.TEXT_NODE) {
        parent.appendChild(document.createTextNode(n.textContent || ''));
      } else if (n.nodeType === Node.ELEMENT_NODE) {
        const el = n as Element;
        // Skip span elements that only have style - flatten their content
        if (el.tagName === 'SPAN' && el.getAttribute('style')) {
          // Flatten: just process children directly into parent
          el.childNodes.forEach(child => processNode(child, parent));
        } else {
          // Keep structural elements like p, h1, h2, etc.
          const clone = document.createElement(el.tagName);
          // Copy non-style attributes
          Array.from(el.attributes).forEach(attr => {
            if (attr.name !== 'style') {
              clone.setAttribute(attr.name, attr.value);
            }
          });
          el.childNodes.forEach(child => processNode(child, clone));
          parent.appendChild(clone);
        }
      }
    };
    
    node.childNodes.forEach(child => processNode(child, fragment));
    return fragment;
  };

  const applyStyleToSelection = (styleProp: 'fontFamily' | 'fontSize', value: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      return false;
    }

    const range = selection.getRangeAt(0);
    
    // Extract content
    const extractedContent = range.extractContents();
    
    // Create a temp container to process
    const tempDiv = document.createElement('div');
    tempDiv.appendChild(extractedContent);
    
    // Get flattened content (removing existing style spans)
    const cleanContent = getTextContentPreservingStructure(tempDiv);
    
    // Wrap in a new span with the desired style
    const span = document.createElement('span');
    span.style[styleProp] = value;
    span.appendChild(cleanContent);
    
    range.insertNode(span);
    
    // Restore selection
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    selection.addRange(newRange);
    
    contentRef.current?.focus();
    return true;
  };

  const handleFontFamilyChange = (fontFamily: string) => {
    if (!applyStyleToSelection('fontFamily', fontFamily)) {
      updateEditorSettings({ fontFamily });
    }
  };

  const handleFontSizeChange = (fontSize: number) => {
    if (!applyStyleToSelection('fontSize', `${fontSize}px`)) {
      updateEditorSettings({ fontSize });
    }
  };

  const handlePageCountChange = (delta: number) => {
    const newCount = Math.max(1, Math.min(20, editorSettings.pageCount + delta));
    updateEditorSettings({ pageCount: newCount });
  };

  const setPageCount = (count: number) => {
    updateEditorSettings({ pageCount: Math.max(1, Math.min(20, count)) });
  };

  // For reformatter mode, calculate pages based on content
  const calculatePagesFromContent = useCallback(() => {
    if (!generatedDocument) return 1;
    const charCount = generatedDocument.content.length;
    // Approximately 3000 characters per A4 page
    return Math.max(1, Math.ceil(charCount / 3000));
  }, [generatedDocument]);

  const effectivePageCount = activeMode === 'reformatter' 
    ? calculatePagesFromContent() 
    : editorSettings.pageCount;

  if (!generatedDocument) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedDocument.content);
    toast.success('Content copied to clipboard');
  };

  const handleDownload = () => {
    const blob = new Blob([generatedDocument.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedDocument.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Document downloaded');
  };

  const handleNewDocument = () => {
    setGeneratedDocument(null);
    resetInput();
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return date.toLocaleTimeString();
  };

  const currentFont = FONT_FAMILIES.find(f => f.value === editorSettings.fontFamily);
  const wordCount = generatedDocument.content.split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-4">
      {/* Top action bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <button
          onClick={handleNewDocument}
          className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
        >
          <RefreshCw className="h-4 w-4" />
          New Document
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            <Copy className="h-4 w-4" />
            Copy
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90">
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </motion.div>

      {/* Editor container with fixed toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col rounded-2xl border border-border bg-card shadow-xl max-h-[calc(100vh-180px)]"
      >
        {/* Fixed Toolbar */}
        <div className="flex-shrink-0 flex flex-wrap items-center gap-1 border-b border-border bg-muted/95 px-4 py-2">
          {/* Undo/Redo */}
          <button
            onClick={() => execCommand('undo')}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('redo')}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </button>

          <div className="mx-1 h-6 w-px bg-border" />

          {/* Font Family Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <Type className="h-4 w-4" />
                <span className="hidden sm:inline">{currentFont?.label || 'Font'}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {FONT_FAMILIES.map((font) => (
                <DropdownMenuItem
                  key={font.value}
                  onClick={() => handleFontFamilyChange(font.value)}
                  className={editorSettings.fontFamily === font.value ? 'bg-accent' : ''}
                  style={{ fontFamily: font.value }}
                >
                  {font.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Font Size Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <span>{editorSettings.fontSize}px</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {FONT_SIZES.map((size) => (
                <DropdownMenuItem
                  key={size}
                  onClick={() => handleFontSizeChange(size)}
                  className={editorSettings.fontSize === size ? 'bg-accent' : ''}
                >
                  {size}px
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="mx-1 h-6 w-px bg-border" />

          {/* Heading buttons */}
          <button
            onClick={() => execCommand('formatBlock', 'h2')}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('formatBlock', 'h3')}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </button>

          <div className="mx-1 h-6 w-px bg-border" />

          {/* Text formatting */}
          <button
            onClick={() => execCommand('bold')}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('italic')}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('underline')}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </button>

          <div className="mx-1 h-6 w-px bg-border" />

          {/* Alignment */}
          <button
            onClick={() => execCommand('justifyLeft')}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('justifyCenter')}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('justifyRight')}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </button>

          <div className="mx-1 h-6 w-px bg-border" />

          {/* List, Quote, Link, Image */}
          <button
            onClick={() => execCommand('insertUnorderedList')}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('formatBlock', 'blockquote')}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              const url = prompt('Enter URL:');
              if (url) execCommand('createLink', url);
            }}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="Link"
          >
            <Link2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              const url = prompt('Enter image URL:');
              if (url) execCommand('insertImage', url);
            }}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="Image"
          >
            <Image className="h-4 w-4" />
          </button>

          <div className="mx-1 h-6 w-px bg-border" />

          {/* Regenerate Selected */}
          <button
            onClick={handleRegenerateSelected}
            disabled={isRegenerating}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 px-3 py-1.5 text-sm font-medium text-primary transition-all hover:from-primary/20 hover:to-accent/20 disabled:opacity-50"
            title="Regenerate Selected Content"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Regenerate</span>
          </button>

          <div className="flex-1" />

          {/* Page Count Control */}
          <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-2 py-1">
            <FileText className="h-4 w-4 text-muted-foreground" />
            {activeMode === 'reformatter' ? (
              <span className="text-sm text-muted-foreground">
                {effectivePageCount} {effectivePageCount === 1 ? 'page' : 'pages'} (auto)
              </span>
            ) : (
              <>
                <button
                  onClick={() => handlePageCountChange(-1)}
                  className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
                  disabled={editorSettings.pageCount <= 1}
                >
                  <Minus className="h-3 w-3" />
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="min-w-[60px] text-center text-sm text-foreground">
                      {editorSettings.pageCount} {editorSettings.pageCount === 1 ? 'page' : 'pages'}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
                      <DropdownMenuItem
                        key={count}
                        onClick={() => setPageCount(count)}
                        className={editorSettings.pageCount === count ? 'bg-accent' : ''}
                      >
                        {count} {count === 1 ? 'page' : 'pages'}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  onClick={() => handlePageCountChange(1)}
                  className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
                  disabled={editorSettings.pageCount >= 20}
                >
                  <Plus className="h-3 w-3" />
                </button>
              </>
            )}
          </div>

          <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* A4 Pages Canvas - Scrollable */}
        <div className="flex-1 overflow-auto min-h-[400px] bg-muted/20 p-8">
          <div className="flex flex-col items-center gap-8">
            {Array.from({ length: effectivePageCount }).map((_, pageIndex) => (
              <motion.div
                key={pageIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + pageIndex * 0.05 }}
                className="relative w-full max-w-[794px] bg-white shadow-2xl"
                style={{
                  minHeight: `${A4_HEIGHT_PX}px`,
                  fontFamily: editorSettings.fontFamily,
                  fontSize: `${editorSettings.fontSize}px`,
                }}
              >
                {/* Page number */}
                <div className="absolute bottom-4 right-6 text-sm text-muted-foreground">
                  Page {pageIndex + 1} of {effectivePageCount}
                </div>

                {/* A4 Format Label */}
                <div className="absolute right-6 top-4 text-xs text-muted-foreground/50">
                  A4
                </div>

                {/* Page content */}
                <div 
                  className="p-12 lg:p-16"
                  style={{ minHeight: `${A4_HEIGHT_PX - 60}px` }}
                >
                {pageIndex === 0 ? (
                    <>
                      {/* Document title - First page only */}
                      <div className="mb-8 border-b border-border/30 pb-8">
                        <h1
                          ref={titleRef}
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={handleTitleChange}
                          className="text-3xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-4 rounded-lg sm:text-4xl cursor-text"
                          spellCheck={false}
                          style={{ fontFamily: editorSettings.fontFamily }}
                        />
                      </div>

                      {/* Document content */}
                      <div
                        ref={contentRef}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={handleContentChange}
                        className="prose prose-lg prose-slate max-w-none outline-none focus:ring-2 focus:ring-primary/20 rounded-lg cursor-text [&>*]:outline-none"
                        spellCheck={false}
                        style={{ 
                          fontFamily: editorSettings.fontFamily,
                          fontSize: `${editorSettings.fontSize}px`,
                          lineHeight: '1.75',
                        }}
                      />
                    </>
                  ) : (
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      className="prose prose-lg prose-slate max-w-none outline-none focus:ring-2 focus:ring-primary/20 rounded-lg cursor-text [&>*]:outline-none min-h-[200px]"
                      spellCheck={false}
                      style={{ 
                        fontFamily: editorSettings.fontFamily,
                        fontSize: `${editorSettings.fontSize}px`,
                        lineHeight: '1.75',
                      }}
                      data-placeholder={`Continue writing on page ${pageIndex + 1}...`}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border bg-muted/20 px-6 py-3">
          <span className="text-xs text-muted-foreground">
            Generated with AI • Last saved {formatTimeAgo(lastSaved)}
          </span>
          <span className="text-xs text-muted-foreground">
            {effectivePageCount} A4 {effectivePageCount === 1 ? 'page' : 'pages'} • Auto-save enabled
          </span>
        </div>
      </motion.div>
    </div>
  );
};