'use client';

import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import type Player from 'video.js/dist/types/player';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export function VideoPlayer({ src, poster, onEnded, onTimeUpdate }: VideoPlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      const player = videojs(videoElement, {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
        sources: [
          {
            src: src,
            type: 'video/mp4',
          },
        ],
        poster: poster,
      });

      playerRef.current = player;

      // Handle video ended event
      player.on('ended', () => {
        onEnded?.();
      });

      // Handle time update for progress tracking
      player.on('timeupdate', () => {
        const currentTime = player.currentTime() || 0;
        const duration = player.duration() || 0;
        onTimeUpdate?.(currentTime, duration);
      });
    }
  }, [src, poster, onEnded, onTimeUpdate]);


  // Update source when src changes
  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      player.src([{ src: src, type: 'video/mp4' }]);
      if (poster) {
        player.poster(poster);
      }
    }
  }, [src, poster]);

  // Dispose the Video.js player when the component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player className="rounded-lg overflow-hidden">
      <div ref={videoRef} />
    </div>
  );
}
