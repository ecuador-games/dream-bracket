"use client";

import { useRef } from "react";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MatchCard } from "./match-card";

interface Team {
  id: string;
  name: string;
  logo_url: string | null;
}

interface Match {
  id: string;
  round: "16" | "8" | "4" | "2" | "1";
  position: number;
  team1_id: string | null;
  team2_id: string | null;
  winner_id: string | null;
  score_team1: number | null;
  score_team2: number | null;
}

interface BracketViewProps {
  matches: Match[];
  teams: Team[];
  tournamentTitle: string;
  onMatchUpdate?: (matchId: string, winnerId: string, score1: number, score2: number) => void;
}

export function BracketView({ matches, teams, tournamentTitle, onMatchUpdate }: BracketViewProps) {
  const bracketRef = useRef<HTMLDivElement>(null);

  const getTeamById = (id: string | null) => {
    if (!id) return null;
    return teams.find((t) => t.id === id) || null;
  };

  const getMatchesByRound = (round: string) => {
    return matches.filter((m) => m.round === round).sort((a, b) => a.position - b.position);
  };

  const exportAsImage = async () => {
    if (!bracketRef.current) return;

    try {
      const dataUrl = await toPng(bracketRef.current, {
        quality: 1,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `${tournamentTitle.replace(/\s+/g, "-")}-bracket.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error exporting bracket:", error);
    }
  };

  const round16 = getMatchesByRound("16");
  const round8 = getMatchesByRound("8");
  const round4 = getMatchesByRound("4");
  const round2 = getMatchesByRound("2");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{tournamentTitle}</h2>
        <Button onClick={exportAsImage} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar como Imagen
        </Button>
      </div>

      <div
        ref={bracketRef}
        className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-8 rounded-lg overflow-x-auto"
        style={{ minHeight: "800px" }}
      >
        <div className="absolute inset-0 bg-[url('/champions-bg.svg')] opacity-10" />
        
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-center text-yellow-400 mb-8 tracking-wider">
            OCTAVOS CHAMPIONS LEAGUE 2025
          </h1>

          <div className="grid grid-cols-7 gap-4" style={{ minWidth: "1400px" }}>
            {/* Left Side - Round of 16 (Top 4) */}
            <div className="space-y-6">
              {round16.slice(0, 4).map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  team1={getTeamById(match.team1_id)}
                  team2={getTeamById(match.team2_id)}
                  onUpdate={onMatchUpdate}
                />
              ))}
            </div>

            {/* Left Quarter-finals (Top 2) */}
            <div className="space-y-12 pt-12">
              {round8.slice(0, 2).map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  team1={getTeamById(match.team1_id)}
                  team2={getTeamById(match.team2_id)}
                  onUpdate={onMatchUpdate}
                />
              ))}
            </div>

            {/* Left Semi-final */}
            <div className="flex items-center justify-center">
              {round4[0] && (
                <MatchCard
                  match={round4[0]}
                  team1={getTeamById(round4[0].team1_id)}
                  team2={getTeamById(round4[0].team2_id)}
                  onUpdate={onMatchUpdate}
                />
              )}
            </div>

            {/* Final */}
            <div className="flex items-center justify-center">
              {round2[0] && (
                <div className="relative">
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                    <div className="text-6xl">🏆</div>
                  </div>
                  <MatchCard
                    match={round2[0]}
                    team1={getTeamById(round2[0].team1_id)}
                    team2={getTeamById(round2[0].team2_id)}
                    onUpdate={onMatchUpdate}
                    isFinal
                  />
                </div>
              )}
            </div>

            {/* Right Semi-final */}
            <div className="flex items-center justify-center">
              {round4[1] && (
                <MatchCard
                  match={round4[1]}
                  team1={getTeamById(round4[1].team1_id)}
                  team2={getTeamById(round4[1].team2_id)}
                  onUpdate={onMatchUpdate}
                />
              )}
            </div>

            {/* Right Quarter-finals (Bottom 2) */}
            <div className="space-y-12 pt-12">
              {round8.slice(2, 4).map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  team1={getTeamById(match.team1_id)}
                  team2={getTeamById(match.team2_id)}
                  onUpdate={onMatchUpdate}
                />
              ))}
            </div>

            {/* Right Side - Round of 16 (Bottom 4) */}
            <div className="space-y-6">
              {round16.slice(4, 8).map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  team1={getTeamById(match.team1_id)}
                  team2={getTeamById(match.team2_id)}
                  onUpdate={onMatchUpdate}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
