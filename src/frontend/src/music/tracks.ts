// Upbeat and positive royalty-free music tracks configuration
export interface MusicTrack {
  id: string;
  title: string;
  src: string;
  attribution: string;
}

export const tracks: MusicTrack[] = [
  {
    id: 'positive-vibes-1',
    title: 'Sunny Day Ahead',
    src: '/assets/music/positive-vibes-1.mp3',
    attribution: 'Music: "Sunny Day Ahead" - Royalty-free upbeat background music',
  },
  {
    id: 'positive-vibes-2',
    title: 'Happy Morning',
    src: '/assets/music/positive-vibes-2.mp3',
    attribution: 'Music: "Happy Morning" - Royalty-free positive vibes track',
  },
];
