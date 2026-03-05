import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BracketView } from "@/components/bracket/bracket-view";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function TournamentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: tournament } = await supabase
    .from("tournaments")
    .select("*")
    .eq("id", id)
    .single();

  if (!tournament) {
    redirect("/dashboard");
  }

  const { data: matches } = await supabase
    .from("matches")
    .select("*")
    .eq("tournament_id", id)
    .order("round", { ascending: false })
    .order("position", { ascending: true });

  const { data: participants } = await supabase
    .from("tournament_participants")
    .select(`
      *,
      teams (*)
    `)
    .eq("tournament_id", id);

  const teams = participants?.map((p: any) => p.teams) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Dashboard
            </Button>
          </Link>
        </div>

        {matches && matches.length > 0 ? (
          <BracketView
            matches={matches}
            teams={teams}
            tournamentTitle={tournament.title}
          />
        ) : (
          <div className="text-center text-white">
            <p className="text-xl mb-4">Este torneo aún no tiene partidos generados</p>
            <Link href={`/dashboard/tournaments/${id}/setup`}>
              <Button>Configurar Equipos</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
