import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-yellow-400">Dashboard</h1>
            <p className="text-white/80 mt-2">
              Bienvenido, {profile?.username} ({profile?.role})
            </p>
          </div>
          <form action="/auth/signout" method="post">
            <Button variant="outline" className="text-white border-white hover:bg-white/10">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </form>
        </div>

        <Tabs defaultValue="my-tournaments" className="space-y-4">
          <TabsList className="bg-white/10">
            <TabsTrigger value="my-tournaments">Mis Torneos</TabsTrigger>
            <TabsTrigger value="public">Explorar Públicos</TabsTrigger>
          </TabsList>

          <TabsContent value="my-tournaments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Mis Torneos</h2>
              {(profile?.role === "organizer" || profile?.role === "admin") && (
                <Link href="/dashboard/tournaments/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Torneo
                  </Button>
                </Link>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myTournaments?.map((tournament) => (
                <Link key={tournament.id} href={`/dashboard/tournaments/${tournament.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        {tournament.title}
                      </CardTitle>
                      <CardDescription>
                        Estado: {tournament.status}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Creado: {new Date(tournament.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              {(!myTournaments || myTournaments.length === 0) && (
                <Card className="col-span-full">
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">
                      No tienes torneos creados aún
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="public" className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Torneos Públicos</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {publicTournaments?.map((tournament) => (
                <Link key={tournament.id} href={`/dashboard/tournaments/${tournament.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        {tournament.title}
                      </CardTitle>
                      <CardDescription>
                        Estado: {tournament.status}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Creado: {new Date(tournament.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              {(!publicTournaments || publicTournaments.length === 0) && (
                <Card className="col-span-full">
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">
                      No hay torneos públicos disponibles
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
