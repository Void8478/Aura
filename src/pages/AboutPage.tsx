import React, { useEffect } from 'react';
import { Disc3, Radio, ShieldCheck, Waves } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { CuratorNote } from '../components/common/CuratorNote';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    document.title = 'About — AURA';
  }, []);
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 space-y-12">
      <div className="border-b border-aura-800 pb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="accent">Colophon & Statement</Badge>
          <span className="text-xs font-mono text-aura-500">ISSN 2984-184X</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-aura-100 font-normal leading-tight">
          About AURA
        </h1>
        <p className="font-serif text-lg sm:text-xl text-aura-300 italic mt-3">
          An independent music publication and modern tactile audio product.
        </p>
      </div>

      <div className="prose prose-invert max-w-none text-aura-300 font-sans leading-relaxed text-base space-y-6">
        <p className="text-lg text-aura-200">
          AURA was born out of a desire for intentional listening in an era dominated by disposable
          algorithms and hyper-compressed audio streams.
        </p>

        <p>
          We treat music discovery as an editorial art form. Rather than offering endless randomized
          feeds, we curate quarterly issues that explore physical room acoustics, magnetic tape decay,
          and intimate compositions.
        </p>

        <CuratorNote
          quote="Physical constraints and intentionality restore meaning to sound. When background noise is preserved, the listener sits in the very room where the music breathed."
          author="The Editorial Board"
          role="Sheffield • Kyoto • Berlin"
        />

        <h3 className="font-serif text-2xl text-aura-100 font-medium pt-4">
          Core Engineering Principles
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
          <div className="p-5 rounded-2xl bg-aura-850 border border-aura-800 space-y-2">
            <div className="flex items-center gap-2 text-aura-accent">
              <Waves className="w-4 h-4" />
              <h4 className="font-serif text-base text-aura-100 font-medium">Real-Time Web Audio</h4>
            </div>
            <p className="text-xs text-aura-400 leading-relaxed">
              Every frequency visualization runs live through the Web Audio Analyser API without
              caching or simulated animations.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-aura-850 border border-aura-800 space-y-2">
            <div className="flex items-center gap-2 text-aura-amber">
              <ShieldCheck className="w-4 h-4" />
              <h4 className="font-serif text-base text-aura-100 font-medium">Zero Tracking & Local State</h4>
            </div>
            <p className="text-xs text-aura-400 leading-relaxed">
              All crates, favorites, and personal liner notes reside strictly in your browser's local
              storage. No third-party trackers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-aura-850 border border-aura-800 space-y-2">
            <div className="flex items-center gap-2 text-aura-olive">
              <Disc3 className="w-4 h-4" />
              <h4 className="font-serif text-base text-aura-100 font-medium">Creative Commons Audio</h4>
            </div>
            <p className="text-xs text-aura-400 leading-relaxed">
              Every stem and recording in our catalog is legally accessible through Creative Commons
              and open audio licensing protocols.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-aura-850 border border-aura-800 space-y-2">
            <div className="flex items-center gap-2 text-aura-300">
              <Radio className="w-4 h-4" />
              <h4 className="font-serif text-base text-aura-100 font-medium">Tactile Controls</h4>
            </div>
            <p className="text-xs text-aura-400 leading-relaxed">
              Designed with comprehensive keyboard bindings and micro-interactions reminiscent of
              vintage reel-to-reel tape decks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
