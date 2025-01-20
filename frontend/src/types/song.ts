export interface Song {
  title: string;
  artist: string;
  album: string;
  album_art: string | null;
  lyrics: string[];
  has_subtitles: boolean;
}