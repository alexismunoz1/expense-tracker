import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React Compiler for automatic memoization
  reactCompiler: true,

  // Configuración para Tesseract.js en Next.js 16
  // Marcar como paquete externo para que no sea procesado por Turbopack
  serverExternalPackages: ['tesseract.js'],

  // Configuración vacía de Turbopack para silenciar warnings
  turbopack: {},
};

export default nextConfig;
