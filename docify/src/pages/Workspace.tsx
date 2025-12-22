import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, FileText, FileUp, Columns } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { InputPanel } from '@/components/features/InputPanel';
import { GenerateButton } from '@/components/features/GenerateButton';
import { EditorCanvas } from '@/components/preview/EditorCanvas';
import { BackgroundEffects } from '@/components/ui/BackgroundEffects';
import { useDocumentStore } from '@/store/documentStore';
import { FEATURES } from '@/config/features';

const iconMap = {
  Sparkles,
  FileText,
  FileUp,
  Columns,
};

const Workspace = () => {
  const navigate = useNavigate();
  const { activeMode, generatedDocument } = useDocumentStore();
  const [isLoading, setIsLoading] = useState(true);
  const feature = FEATURES[activeMode];
  const Icon = iconMap[feature.icon as keyof typeof iconMap];

  useEffect(() => {
    // Initial loading animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      <BackgroundEffects />
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
          >
            {/* Animated loader */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="relative"
            >
              {/* Outer ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-primary/20"
                style={{ width: 120, height: 120 }}
              />
              
              {/* Spinning ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="rounded-full border-4 border-transparent border-t-primary"
                style={{ width: 120, height: 120 }}
              />
              
              {/* Center icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-hero text-primary-foreground">
                  <Icon className="h-8 w-8" />
                </div>
              </motion.div>
            </motion.div>

            {/* Loading text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-8 text-center"
            >
              <h2 className="text-2xl font-semibold text-foreground">{feature.title}</h2>
              <p className="mt-2 text-muted-foreground">Preparing your workspace...</p>
            </motion.div>

            {/* Animated dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 flex gap-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut"
                  }}
                  className="h-2 w-2 rounded-full bg-primary"
                />
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Header />
            
            <main className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
              {/* Back button and title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <button
                  onClick={() => navigate('/')}
                  className="group mb-4 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  <span className="text-sm font-medium">Back to workflows</span>
                </button>
                
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-hero text-primary-foreground shadow-lg">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{feature.title}</h1>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </motion.div>

              {/* Main content */}
              <AnimatePresence mode="wait">
                {!generatedDocument ? (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="mx-auto max-w-3xl space-y-6"
                  >
                    <InputPanel />
                    <GenerateButton />
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <EditorCanvas />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Workspace;
