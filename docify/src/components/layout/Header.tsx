import { motion } from 'framer-motion';
import { FileText, Menu } from 'lucide-react';
import { useState } from 'react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-card mt-4 rounded-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-hero">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-foreground">
                  DocuMind
                </span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  Intelligence
                </span>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-8 md:flex">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#how-it-works">How it works</NavLink>
              <NavLink href="#pricing">Pricing</NavLink>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden rounded-xl bg-secondary px-5 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 sm:block"
              >
                Sign in
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary hidden px-5 py-2.5 text-sm sm:flex"
              >
                Get Started
              </motion.button>
              
              {/* Mobile menu button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="rounded-lg p-2 text-foreground hover:bg-secondary md:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.nav 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex flex-col gap-2 border-t border-border/50 pt-4 md:hidden"
            >
              <MobileNavLink href="#features">Features</MobileNavLink>
              <MobileNavLink href="#how-it-works">How it works</MobileNavLink>
              <MobileNavLink href="#pricing">Pricing</MobileNavLink>
              <div className="mt-2 flex gap-2">
                <button className="flex-1 rounded-xl bg-secondary px-4 py-2.5 text-sm font-medium">
                  Sign in
                </button>
                <button className="btn-primary flex-1 px-4 py-2.5 text-sm">
                  Get Started
                </button>
              </div>
            </motion.nav>
          )}
        </div>
      </div>
    </motion.header>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a 
    href={href}
    className="relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
  >
    {children}
  </a>
);

const MobileNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a 
    href={href}
    className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
  >
    {children}
  </a>
);
