import { ReactNode } from "react";
import Image from "next/image";

interface DLSBackgroundProps {
  children: ReactNode;
  variant?: "default" | "auth" | "dashboard";
}

export function DLSBackground({ children, variant = "default" }: DLSBackgroundProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-blue-900 to-purple-900" />
      
      {/* Animated Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Left Player - Barcelona (Red/Blue) */}
      <div className="absolute left-0 bottom-0 w-1/4 h-full opacity-20 pointer-events-none">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 to-transparent" />
          <Image
            src="/player-barcelona.png"
            alt="Barcelona Player"
            fill
            className="object-contain object-bottom"
            priority
          />
        </div>
      </div>

      {/* Right Player - Atletico (Red/White/Blue) */}
      <div className="absolute right-0 bottom-0 w-1/4 h-full opacity-20 pointer-events-none">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-l from-blue-600/30 to-transparent" />
          <Image
            src="/player-atletico.png"
            alt="Atletico Player"
            fill
            className="object-contain object-bottom"
            priority
          />
        </div>
      </div>

      {/* Soccer Ball Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-1/4 w-16 h-16">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
            <circle cx="50" cy="50" r="45" className="text-white" />
            <path d="M50,10 L65,35 L50,45 L35,35 Z" className="text-gray-800" />
            <path d="M50,55 L65,65 L50,90 L35,65 Z" className="text-gray-800" />
            <path d="M20,30 L35,35 L30,55 L10,50 Z" className="text-gray-800" />
            <path d="M80,30 L90,50 L70,55 L65,35 Z" className="text-gray-800" />
            <path d="M20,70 L30,55 L35,65 L25,85 Z" className="text-gray-800" />
            <path d="M80,70 L75,85 L65,65 L70,55 Z" className="text-gray-800" />
          </svg>
        </div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
            <circle cx="50" cy="50" r="45" className="text-white" />
            <path d="M50,10 L65,35 L50,45 L35,35 Z" className="text-gray-800" />
            <path d="M50,55 L65,65 L50,90 L35,65 Z" className="text-gray-800" />
          </svg>
        </div>
        <div className="absolute top-1/3 left-1/3 w-10 h-10">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
            <circle cx="50" cy="50" r="45" className="text-white" />
            <path d="M50,10 L65,35 L50,45 L35,35 Z" className="text-gray-800" />
          </svg>
        </div>
      </div>

      {/* DLS 25 Logo Style */}
      {variant === "default" && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5">
          <div className="text-[20rem] font-black text-white/20">25</div>
        </div>
      )}

      {/* Diagonal Lines Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="diagonalLines" patternUnits="userSpaceOnUse" width="50" height="50">
              <path d="M-10,10 l20,-20 M0,50 l50,-50 M40,60 l20,-20" stroke="white" strokeWidth="2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonalLines)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
