"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewTournamentPage() {
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Debes iniciar sesión");
      setLoading(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from("tournaments")
      .insert({
        creator_id: user.id,
        title,
        is_public: isPublic,
        status: "draft",
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      router.push(`/dashboard/tournaments/${data.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="text-white mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Button>
        </Link>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Crear Nuevo Torneo</CardTitle>
            <CardDescription>
              Configura tu torneo de Dream League Soccer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título del Torneo</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Champions League 2025"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="isPublic" className="cursor-pointer">
                  Torneo público (visible para todos)
                </Label>
              </div>

              {error && (
                <div className="text-sm text-red-500 bg-red-50 p-3 rounded">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creando..." : "Crear Torneo"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
