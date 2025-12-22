import { motion } from 'framer-motion';
import { Sparkles, FileText, FileUp, Columns } from 'lucide-react';
import { FEATURES, FEATURE_ORDER } from '@/config/features';
import { useDocumentStore } from '@/store/documentStore';
import { FeatureMode } from '@/types';

const iconMap = {
  Sparkles,
  FileText,
  FileUp,
  Columns,
};

export const FeatureSelector = () => {
  const { activeMode, setActiveMode } = useDocumentStore();

  return (
    <div className="w-full">
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="section-label mb-4 text-center"
      >
        Choose your workflow
      </motion.p>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURE_ORDER.map((featureId, index) => {
          const feature = FEATURES[featureId];
          const Icon = iconMap[feature.icon as keyof typeof iconMap];
          const isActive = activeMode === featureId;

          return (
            <motion.button
              key={featureId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.1 * index,
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
              }}
              onClick={() => setActiveMode(featureId)}
              className={`feature-card group text-left ${isActive ? 'active' : ''}`}
            >
              {/* Glow effect for active card */}
              {isActive && (
                <motion.div
                  layoutId="activeGlow"
                  className="absolute inset-0 -z-10 rounded-2xl bg-gradient-glow opacity-50"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              <div className={`
                mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300
                ${isActive 
                  ? 'bg-gradient-hero text-primary-foreground' 
                  : 'bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                }
              `}>
                <Icon className="h-6 w-6" />
              </div>

              <h3 className={`
                mb-2 text-lg font-semibold transition-colors duration-300
                ${isActive ? 'text-primary' : 'text-foreground'}
              `}>
                {feature.title}
              </h3>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute bottom-0 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-gradient-hero"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
