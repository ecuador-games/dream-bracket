import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Image } from "lucide-react";
import { DLSBackground } from "@/components/ui/dls-background";

export default function HomePage() {
  return (
    <DLSBackground variant="default">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="relative">
            <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 tracking-wider drop-shadow-2xl">
              DREAMBRACKET
            </h1>
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-sm text-yellow-400/60 tracking-widest">
              DREAM LEAGUE SOCCER
            </div>
          </div>
          
          <p className="text-2xl md:text-3xl text-white/90 font-semibold drop-shadow-lg">
            Gestiona torneos competitivos de Dream League Soccer
          </p>

          <div className="flex justify-center gap-4 pt-8">
            <Link href="/auth/login">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold shadow-xl">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="text-white border-2 border-yellow-400 hover:bg-yellow-400/20 font-bold shadow-xl">
                Registrarse
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-16 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border-2 border-white/20 hover:border-yellow-400/50 transition-all hover:scale-105 shadow-2xl">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4 drop-shadow-lg" />
              <h3 className="text-2xl font-bold text-white mb-3">
                Crea Torneos
              </h3>
              <p className="text-white/80 text-lg">
                Organiza llaves de 16 equipos con sorteo automático
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border-2 border-white/20 hover:border-yellow-400/50 transition-all hover:scale-105 shadow-2xl">
              <Users className="w-16 h-16 text-yellow-400 mx-auto mb-4 drop-shadow-lg" />
              <h3 className="text-2xl font-bold text-white mb-3">
                Gestiona Equipos
              </h3>
              <p className="text-white/80 text-lg">
                Crea y administra tus equipos personalizados
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border-2 border-white/20 hover:border-yellow-400/50 transition-all hover:scale-105 shadow-2xl">
              <Image className="w-16 h-16 text-yellow-400 mx-auto mb-4 drop-shadow-lg" />
              <h3 className="text-2xl font-bold text-white mb-3">
                Exporta Resultados
              </h3>
              <p className="text-white/80 text-lg">
                Descarga el bracket como imagen de alta calidad
              </p>
            </div>
          </div>
        </div>
      </div>
    </DLSBackground>
  );
}
