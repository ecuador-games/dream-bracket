import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Image } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-bold text-yellow-400 tracking-wider">
            DREAMBRACKET
          </h1>
          <p className="text-2xl text-white/90">
            Gestiona torneos competitivos de Dream League Soccer
          </p>

          <div className="flex justify-center gap-4 pt-8">
            <Link href="/auth/login">
              <Button size="lg" variant="default">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Registrarse
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-16 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Crea Torneos
              </h3>
              <p className="text-white/80">
                Organiza llaves de 16 equipos con sorteo automático
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Users className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Gestiona Equipos
              </h3>
              <p className="text-white/80">
                Crea y administra tus equipos personalizados
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Image className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Exporta Resultados
              </h3>
              <p className="text-white/80">
                Descarga el bracket como imagen de alta calidad
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
