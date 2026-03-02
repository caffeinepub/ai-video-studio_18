export type MusicCategory =
  | "Cinematic"
  | "Epic"
  | "Calm"
  | "Upbeat"
  | "Romantic";

export interface MusicTrack {
  id: string;
  name: string;
  category: MusicCategory;
  duration: string;
  emoji: string;
}

export const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: "track-1",
    name: "Cinematic Dawn",
    category: "Cinematic",
    duration: "2:34",
    emoji: "🎬",
  },
  {
    id: "track-2",
    name: "Epic Journey",
    category: "Epic",
    duration: "3:12",
    emoji: "⚡",
  },
  {
    id: "track-3",
    name: "Calm Waters",
    category: "Calm",
    duration: "4:01",
    emoji: "🌊",
  },
  {
    id: "track-4",
    name: "Upbeat Vibes",
    category: "Upbeat",
    duration: "2:45",
    emoji: "🎵",
  },
  {
    id: "track-5",
    name: "Romantic Sunset",
    category: "Romantic",
    duration: "3:30",
    emoji: "🌅",
  },
  {
    id: "track-6",
    name: "Dark Matter",
    category: "Cinematic",
    duration: "2:58",
    emoji: "🌑",
  },
  {
    id: "track-7",
    name: "Summer Flow",
    category: "Upbeat",
    duration: "2:20",
    emoji: "☀️",
  },
  {
    id: "track-8",
    name: "Mountain Echo",
    category: "Epic",
    duration: "3:45",
    emoji: "🏔️",
  },
];

export const MUSIC_CATEGORIES: MusicCategory[] = [
  "Cinematic",
  "Epic",
  "Calm",
  "Upbeat",
  "Romantic",
];

export const NO_MUSIC_ID = "no-music";
