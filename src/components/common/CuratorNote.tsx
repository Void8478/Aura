import React from 'react';
import { Quote } from 'lucide-react';

interface CuratorNoteProps {
  quote: string;
  author: string;
  role?: string;
  className?: string;
}

export const CuratorNote: React.FC<CuratorNoteProps> = ({
  quote,
  author,
  role,
  className = '',
}) => {
  return (
    <div
      className={`relative p-6 sm:p-8 rounded-2xl bg-aura-850/60 border border-aura-800/80 my-6 ${className}`}
    >
      <Quote className="w-8 h-8 text-aura-accent/30 absolute top-4 left-4 -translate-y-1 pointer-events-none" />
      <div className="relative pl-6">
        <p className="font-serif text-lg sm:text-xl text-aura-200 italic leading-relaxed">
          {quote}
        </p>
        <div className="mt-4 flex items-center gap-2">
          <span className="w-6 h-[1px] bg-aura-accent/60" />
          <span className="text-xs font-mono uppercase tracking-wider text-aura-400">
            {author}
          </span>
          {role && <span className="text-xs text-aura-600 font-sans">• {role}</span>}
        </div>
      </div>
    </div>
  );
};
