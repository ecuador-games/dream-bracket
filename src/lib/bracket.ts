import { shuffleArray } from "./utils";

export interface Team {
  id: string;
  name: string;
  logo_url: string | null;
}

export interface Match {
  id?: string;
  tournament_id: string;
  round: "16" | "8" | "4" | "2" | "1";
  position: number;
  team1_id: string | null;
  team2_id: string | null;
  winner_id: string | null;
  next_match_id: string | null;
  score_team1: number | null;
  score_team2: number | null;
}

// Generate bracket structure for 16 teams
export function generateBracket(
  tournamentId: string,
  teams: Team[]
): Match[] {
  if (teams.length !== 16) {
    throw new Error("Exactly 16 teams are required");
  }

  // Shuffle teams using Fisher-Yates
  const shuffledTeams = shuffleArray(teams);
  const matches: Match[] = [];

  // Round of 16 (8 matches)
  for (let i = 0; i < 8; i++) {
    matches.push({
      tournament_id: tournamentId,
      round: "16",
      position: i,
      team1_id: shuffledTeams[i * 2].id,
      team2_id: shuffledTeams[i * 2 + 1].id,
      winner_id: null,
      next_match_id: null,
      score_team1: null,
      score_team2: null,
    });
  }

  // Quarter-finals (4 matches)
  for (let i = 0; i < 4; i++) {
    matches.push({
      tournament_id: tournamentId,
      round: "8",
      position: i,
      team1_id: null,
      team2_id: null,
      winner_id: null,
      next_match_id: null,
      score_team1: null,
      score_team2: null,
    });
  }

  // Semi-finals (2 matches)
  for (let i = 0; i < 2; i++) {
    matches.push({
      tournament_id: tournamentId,
      round: "4",
      position: i,
      team1_id: null,
      team2_id: null,
      winner_id: null,
      next_match_id: null,
      score_team1: null,
      score_team2: null,
    });
  }

  // Final (1 match)
  matches.push({
    tournament_id: tournamentId,
    round: "2",
    position: 0,
    team1_id: null,
    team2_id: null,
    winner_id: null,
    next_match_id: null,
    score_team1: null,
    score_team2: null,
  });

  // Set next_match_id references
  // Round of 16 -> Quarter-finals
  for (let i = 0; i < 8; i++) {
    const nextMatchIndex = 8 + Math.floor(i / 2);
    matches[i].next_match_id = `match_${nextMatchIndex}`;
  }

  // Quarter-finals -> Semi-finals
  for (let i = 8; i < 12; i++) {
    const nextMatchIndex = 12 + Math.floor((i - 8) / 2);
    matches[i].next_match_id = `match_${nextMatchIndex}`;
  }

  // Semi-finals -> Final
  for (let i = 12; i < 14; i++) {
    matches[i].next_match_id = `match_14`;
  }

  return matches;
}
