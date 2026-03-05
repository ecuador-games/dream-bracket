"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Team {
  id: string;
  name: string;
  logo_url: string | null;
}

interface Match {
  id: string;
  team1_id: string | null;
  team2_id: string | null;
  winner_id: string | null;
  score_team1: number | null;
  score_team2: number | null;
}

interface MatchCardProps {
  match: Match;
  team1: Team | null;
  team2: Team | null;
  onUpdate?: (matchId: string, winnerId: string, score1: number, score2: number) => void;
  isFinal?: boolean;
}

export function MatchCard({ match, team1, team2, onUpdate, isFinal }: MatchCardProps) {
  const [score1, setScore1] = useState(match.score_team1 ?? 0);
  const [score2, setScore2] = useState(match.score_team2 ?? 0);

  const handleScoreUpdate = () => {
    if (!team1 || !team2 || !onUpdate) return;
    
    const winnerId = score1 > score2 ? team1.id : team2.id;
    onUpdate(match.id, winnerId, score1, score2);
  };

  return (
    <Card
      className={cn(
        "bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden",
        isFinal && "border-yellow-400 border-2"
      )}
    >
      {/* Team 1 */}
      <div
        className={cn(
          "flex items-center justify-between p-3 border-b border-white/10",
          match.winner_id === team1?.id && "bg-green-500/20"
        )}
      >
        <div className="flex items-center gap-2 flex-1">
          {team1?.logo_url ? (
            <img
              src={team1.logo_url}
              alt={team1.name}
              className="w-6 h-6 object-contain"
            />
          ) : (
            <div className="w-6 h-6 bg-gray-500 rounded-full" />
          )}
          <span className="text-white text-sm font-medium truncate">
            {team1?.name || "TBD"}
          </span>
        </div>
        {onUpdate && team1 && team2 ? (
          <input
            type="number"
            min="0"
            value={score1}
            onChange={(e) => setScore1(parseInt(e.target.value) || 0)}
            onBlur={handleScoreUpdate}
            className="w-12 h-8 bg-white/20 text-white text-center rounded border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        ) : (
          <span className="text-white font-bold text-lg w-12 text-center">
            {match.score_team1 ?? "-"}
          </span>
        )}
      </div>

      {/* Team 2 */}
      <div
        className={cn(
          "flex items-center justify-between p-3",
          match.winner_id === team2?.id && "bg-green-500/20"
        )}
      >
        <div className="flex items-center gap-2 flex-1">
          {team2?.logo_url ? (
            <img
              src={team2.logo_url}
              alt={team2.name}
              className="w-6 h-6 object-contain"
            />
          ) : (
            <div className="w-6 h-6 bg-gray-500 rounded-full" />
          )}
          <span className="text-white text-sm font-medium truncate">
            {team2?.name || "TBD"}
          </span>
        </div>
        {onUpdate && team1 && team2 ? (
          <input
            type="number"
            min="0"
            value={score2}
            onChange={(e) => setScore2(parseInt(e.target.value) || 0)}
            onBlur={handleScoreUpdate}
            className="w-12 h-8 bg-white/20 text-white text-center rounded border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        ) : (
          <span className="text-white font-bold text-lg w-12 text-center">
            {match.score_team2 ?? "-"}
          </span>
        )}
      </div>
    </Card>
  );
}
