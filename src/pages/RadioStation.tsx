import React, { useState } from 'react';
import { Radio, Play, Pause, Disc3, Waves } from 'lucide-react';
import { RADIO_STATIONS } from '../services/mockCatalog';
import { usePlayerStore } from '../store/usePlayerStore';
import { ArtworkImage } from '../components/ui/ArtworkImage';
import { Badge } from '../components/ui/Badge';
import { TactileButton } from '../components/ui/TactileButton';
import { VisualizerCanvas } from '../components/player/VisualizerCanvas';

export const RadioStation: React.FC = () => {
  const { playTrack, currentTrack, isPlaying } = usePlayerStore();
  const [selectedStation, setSelectedStation] = useState(RADIO_STATIONS[0]);

  const handleTuneIn = (station: typeof RADIO_STATIONS[0]) => {
    setSelectedStation(station);
    if (station.tracks.length > 0) {
      playTrack(station.tracks[0], station.tracks);
    }
  };

  const isCurrentStationPlaying =
    selectedStation.tracks.some((t) => t.id === currentTrack?.id) && isPlaying;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-aura-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-aura-accent animate-ping" />
            <span className="text-xs font-mono uppercase tracking-wider text-aura-accent">
              Live Atmosphere Broadcasts
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-aura-100 font-normal">
            Atmosphere Radio
          </h1>
          <p className="text-sm text-aura-400 font-sans mt-2 max-w-xl">
            Uninterrupted, generative mood streams engineered for deep concentration, late reading,
            and nocturnal contemplation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <TactileButton
            variant="primary"
            size="lg"
            onClick={() => handleTuneIn(selectedStation)}
            className="gap-2 shadow-aura-subtle"
          >
            {isCurrentStationPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                Pause Broadcast
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Tune In: {selectedStation.name}
              </>
            )}
          </TactileButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 bg-aura-850 border border-aura-700/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-aura-deck tactile-card">
          <div className="flex items-center justify-between border-b border-aura-800 pb-4">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-aura-accent" />
              <span className="font-mono text-xs text-aura-200 uppercase tracking-wider">
                {selectedStation.frequencies}
              </span>
            </div>
            <Badge variant="accent">{selectedStation.mood}</Badge>
          </div>

          <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative w-40 h-40 rounded-full bg-aura-950 border-2 border-aura-700/80 shadow-2xl flex items-center justify-center overflow-hidden">
              <Disc3
                className={`w-28 h-28 text-aura-accent/80 ${
                  isCurrentStationPlaying ? 'animate-spin-slow' : 'opacity-40'
                }`}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-[10px] text-white bg-aura-900/90 px-2 py-1 rounded border border-white/10 uppercase">
                  {selectedStation.mood}
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-2xl sm:text-3xl text-aura-100 font-medium">
                {selectedStation.name}
              </h3>
              <p className="text-sm text-aura-300 font-sans mt-1 max-w-md mx-auto">
                {selectedStation.tagline}
              </p>
            </div>

            <div className="w-full max-w-sm bg-aura-950 p-4 rounded-2xl border border-aura-800">
              <VisualizerCanvas
                mode="wave"
                height={48}
                width={320}
                barColor="#e07a5f"
                className="w-full"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-aura-800 flex items-center justify-between text-xs text-aura-400 font-mono">
            <span>Curator: {selectedStation.curator}</span>
            <span>Stream: 320 kbps Lossless</span>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4 flex flex-col">
          <h3 className="font-serif text-xl text-aura-100 font-medium mb-1">
            Available Frequency Streams
          </h3>

          <div className="space-y-3 flex-1">
            {RADIO_STATIONS.map((station) => {
              const isSelected = selectedStation.id === station.id;
              return (
                <div
                  key={station.id}
                  onClick={() => handleTuneIn(station)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border flex items-center gap-4 ${
                    isSelected
                      ? 'bg-aura-800/90 border-aura-accent/40 shadow-sm'
                      : 'bg-aura-850/60 border-aura-800/80 hover:bg-aura-800/60 hover:border-aura-700'
                  }`}
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/5 relative">
                    <ArtworkImage src={station.coverUrl} alt={station.name} />
                    {isSelected && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Waves className="w-5 h-5 text-aura-accent animate-pulse" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-base text-aura-100 font-medium truncate">
                        {station.name}
                      </h4>
                      <span className="text-[10px] font-mono text-aura-500">
                        {station.frequencies.split(' ')[0]}
                      </span>
                    </div>
                    <p className="text-xs text-aura-400 font-sans mt-0.5 line-clamp-1">
                      {station.tagline}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={isSelected ? 'accent' : 'default'} size="sm">
                        {station.mood}
                      </Badge>
                      <span className="text-[11px] font-mono text-aura-500">
                        {station.tracks.length} track loop
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
