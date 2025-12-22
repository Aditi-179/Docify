import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { HomeFeatureCard } from '@/components/features/HomeFeatureCard';
import { BackgroundEffects } from '@/components/ui/BackgroundEffects';
import { FEATURES, FEATURE_ORDER } from '@/config/features';

const Index = () => {
  return (
    <div className="min-h-screen">
      <BackgroundEffects />
      <Header />
      
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="mb-20 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2"
          >
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">
              AI-Powered Document Intelligence
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Transform ideas into
            <br />
            <span className="gradient-text">beautiful documents</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            From prompts to polished documents in seconds. Research, structure, 
            and format your content with the power of AI.
          </motion.p>
        </motion.section>

        {/* Choose Your Workflow */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-12 text-center"
          >
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Choose your workflow
            </h2>
            <p className="mt-3 text-muted-foreground">
              Select how you want to create your document
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
            {FEATURE_ORDER.map((featureId, index) => (
              <HomeFeatureCard
                key={featureId}
                feature={FEATURES[featureId]}
                index={index}
              />
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Index;
