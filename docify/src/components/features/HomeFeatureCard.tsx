import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, FileText, FileUp, Columns, ArrowRight } from 'lucide-react';
import { useDocumentStore } from '@/store/documentStore';
import { FeatureMode, FeatureConfig } from '@/types';

const iconMap = {
  Sparkles,
  FileText,
  FileUp,
  Columns,
};

interface HomeFeatureCardProps {
  feature: FeatureConfig;
  index: number;
}

export const HomeFeatureCard = ({ feature, index }: HomeFeatureCardProps) => {
  const navigate = useNavigate();
  const { setActiveMode } = useDocumentStore();
  const Icon = iconMap[feature.icon as keyof typeof iconMap];

  const handleClick = () => {
    setActiveMode(feature.id as FeatureMode);
    navigate('/workspace');
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: 0.1 * index,
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="group relative overflow-hidden rounded-3xl bg-card p-8 text-left shadow-lg transition-shadow duration-300 hover:shadow-2xl"
    >
      {/* Gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      
      {/* Glow effect */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-primary/20 group-hover:blur-2xl" />

      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-hero text-primary-foreground shadow-lg shadow-primary/25"
        >
          <Icon className="h-8 w-8" />
        </motion.div>

        {/* Title */}
        <h3 className="mb-3 text-xl font-bold text-foreground sm:text-2xl">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="mb-6 text-muted-foreground leading-relaxed">
          {feature.description}
        </p>

        {/* CTA */}
        <div className="inline-flex items-center gap-2 text-primary font-semibold">
          <span>Get started</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
        </div>
      </div>

      {/* Bottom border accent */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-hero"
        initial={{ width: 0 }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};
