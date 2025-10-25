export type Stage = 'early' | 'multi' | 'late';

export interface Fund {
  id: number;
  name: string;
  website: string;
  stage: Stage;
  logo_url: string | null;
  elo_score: number;
  match_count: number;
  created_at: Date;
}