import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DLSBackground } from "@/components/ui/dls-background";
import Link from "next/link";
import { Plus, Trophy, LogOut } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: myTournaments } = await supabase
    .from("tournaments")
    .select("*")
    .eq("creator_id", user.id)
    .order("created_at", { ascending: false });

  const { data: publicTournaments } = await supabase
    .from("tournaments")
    .select("*")
    .eq("is_public", true)
    .neq("creator_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <DLSBackground variant="dashboard">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-lg">
              Dashboard
            </h1>
            <p className="text-white/90 mt-2 text-lg font-semibold drop-shadow">
              Bienvenido, {profile?.username} 
              <span className="ml-2 px-3 py-1 bg-yellow-400/20 border border-yellow-400 rounded-full text-yellow-400 text-sm">
                {profile?.role}
              </span>
            </p>
          </div>
          <form action="/auth/signout" method="post">
            <Button variant="outline" className="text-white border-2 border-yellow-400 hover:bg-yellow-400/20 font-bold shadow-xl">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </form>
        </div>

        <Tabs defaultValue="my-tournaments" className="space-y-4">
          <TabsList className="bg-white/10 backdrop-blur-md border border-white/20">
            <TabsTrigger value="my-tournaments" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black font-semibold">
              Mis Torneos
            </TabsTrigger>
            <TabsTrigger value="public" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black font-semibold">
              Explorar Públicos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-tournaments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">Mis Torneos</h2>
              {(profile?.role === "organizer" || profile?.role === "admin") && (
                <Link href="/dashboard/tournaments/new">
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold shadow-xl">
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Torneo
                  </Button>
                </Link>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myTournaments?.map((tournament) => (
                <Link key={tournament.id} href={`/dashboard/tournaments/${tournament.id}`}>
                  <Card className="hover:shadow-2xl transition-all cursor-pointer border-2 border-white/20 hover:border-yellow-400/50 bg-white/10 backdrop-blur-md hover:scale-105">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Trophy className="h-5 w-5 text-yellow-400" />
                        {tournament.title}
                      </CardTitle>
                      <CardDescription className="text-white/70">
                        Estado: <span className="font-semibold text-yellow-400">{tournament.status}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-white/60">
                        Creado: {new Date(tournament.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              {(!myTournaments || myTournaments.length === 0) && (
                <Card className="col-span-full bg-white/10 backdrop-blur-md border-2 border-white/20">
                  <CardContent className="pt-6 text-center">
                    <p className="text-white/70 text-lg">
                      No tienes torneos creados aún
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="public" className="space-y-4">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">Torneos Públicos</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {publicTournaments?.map((tournament) => (
                <Link key={tournament.id} href={`/dashboard/tournaments/${tournament.id}`}>
                  <Card className="hover:shadow-2xl transition-all cursor-pointer border-2 border-white/20 hover:border-yellow-400/50 bg-white/10 backdrop-blur-md hover:scale-105">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Trophy className="h-5 w-5 text-yellow-400" />
                        {tournament.title}
                      </CardTitle>
                      <CardDescription className="text-white/70">
                        Estado: <span className="font-semibold text-yellow-400">{tournament.status}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-white/60">
                        Creado: {new Date(tournament.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              {(!publicTournaments || publicTournaments.length === 0) && (
                <Card className="col-span-full bg-white/10 backdrop-blur-md border-2 border-white/20">
                  <CardContent className="pt-6 text-center">
                    <p className="text-white/70 text-lg">
                      No hay torneos públicos disponibles
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DLSBackground>
  );
}
