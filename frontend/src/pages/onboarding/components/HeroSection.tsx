import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HeroSection() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900">
      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl animate-float" />
      <div className="absolute top-40 right-20 w-96 h-96 rounded-full bg-violet-500/15 blur-3xl animate-float-slow" />
      <div className="absolute bottom-20 left-1/3 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl animate-float-slower" />
      <div className="absolute bottom-40 right-10 w-64 h-64 rounded-full bg-indigo-400/10 blur-3xl animate-pulse-soft" />

      {/* Navigation */}
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-indigo-950/80 backdrop-blur-md border-b border-white/10 shadow-lg'
            : 'bg-transparent',
        )}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6 text-indigo-400" strokeWidth={1.5} />
            <span className="text-white font-semibold text-lg">React Boilerplate</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/docs"
              className="text-sm text-indigo-200 hover:text-white transition-colors"
            >
              Documentation
            </Link>
            <Link
              to="/login"
              className="text-sm px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-400 transition-colors font-medium"
            >
              Start Building
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-3xl mx-auto">
          {/* Typewriter title */}
          <h1
            className="overflow-hidden whitespace-nowrap border-r-2 border-white/80 animate-[typewriter_2s_steps(18)_0.5s_forwards,blink_0.75s_step-end_infinite] w-0 font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mx-auto"
          >
            React Boilerplate
          </h1>

          {/* Subtitle */}
          <p
            className="mt-6 text-lg sm:text-xl text-indigo-200/90 max-w-2xl mx-auto animate-fade-in-up opacity-0"
            style={{ animationDelay: '2.8s', animationFillMode: 'forwards' }}
          >
            Production-ready starter kit for building enterprise React applications
          </p>

          {/* Branded badge */}
          <div
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 backdrop-blur-sm animate-fade-in-up opacity-0"
            style={{ animationDelay: '3.2s', animationFillMode: 'forwards' }}
          >
            <span className="text-xs sm:text-sm text-indigo-300 font-medium">
              Powered by Sarvadhi Solutions Pvt. Ltd.
            </span>
          </div>

          {/* CTA buttons */}
          <div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up opacity-0"
            style={{ animationDelay: '3.6s', animationFillMode: 'forwards' }}
          >
            <Link
              to="/docs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors font-medium text-sm"
            >
              Explore Documentation
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-500 text-white hover:bg-indigo-400 transition-colors font-medium text-sm shadow-lg shadow-indigo-500/25"
            >
              Start Building
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
