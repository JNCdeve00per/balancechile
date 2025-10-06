#!/bin/bash

# Script de inicio rápido para desarrollo
# Inicia backend y frontend en terminales separadas

echo "🚀 Balance Chile - Inicio de Desarrollo"
echo "========================================"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecuta este script desde el directorio backend/"
    exit 1
fi

# Verificar que las dependencias están instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del backend..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    cd client && npm install && cd ..
fi

echo ""
echo "✅ Dependencias instaladas"
echo ""
echo "Iniciando servidores..."
echo "  🔧 Backend: http://localhost:3001"
echo "  📱 Frontend: http://localhost:5173"
echo ""
echo "Presiona Ctrl+C para detener ambos servidores"
echo ""

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "🛑 Deteniendo servidores..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Iniciar backend en background
npm run dev &
BACKEND_PID=$!

# Esperar un poco para que el backend inicie
sleep 2

# Iniciar frontend en background
cd client && npm run dev &
FRONTEND_PID=$!
cd ..

# Esperar a que alguno termine
wait
