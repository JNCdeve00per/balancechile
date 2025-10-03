#!/bin/bash

# Demo Script - Balance Chile
# Demuestra cómo los datos cambian dinámicamente por año

echo "🇨🇱 Balance Chile - Demo Sistema Dinámico"
echo "=========================================="
echo ""

# Función para hacer peticiones y mostrar resultados
demo_year() {
    local year=$1
    echo "📅 Año $year:"
    echo "-------------------"
    
    # Obtener datos del presupuesto
    local response=$(curl -s "http://localhost:3001/api/budget?year=$year")
    
    if [ $? -eq 0 ]; then
        # Extraer información clave usando jq si está disponible
        if command -v jq &> /dev/null; then
            local total=$(echo "$response" | jq -r '.data.totalBudget')
            local source=$(echo "$response" | jq -r '.data.source')
            local growth=$(echo "$response" | jq -r '.data.growth')
            
            # Formatear números
            local total_formatted=$(echo "$total" | sed 's/\(.*\)\(...\)\(...\)\(...\)\(...\)/\1.\2.\3.\4.\5/')
            
            echo "💰 Presupuesto Total: $total_formatted CLP"
            echo "📊 Fuente: $source"
            echo "📈 Crecimiento: $growth%"
            
            # Mostrar top 3 ministerios
            echo "🏛️  Top 3 Ministerios:"
            echo "$response" | jq -r '.data.ministries[:3][] | "   • \(.name): $\(.budget | tostring | .[:-9])B CLP (\(.percentage)%)"'
            
        else
            echo "📊 Datos obtenidos exitosamente (instala 'jq' para ver detalles)"
        fi
    else
        echo "❌ Error al obtener datos para $year"
    fi
    
    echo ""
}

# Verificar que el servidor esté corriendo
echo "🔍 Verificando servidor..."
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Servidor corriendo en http://localhost:3001"
    echo ""
else
    echo "❌ Servidor no disponible. Ejecuta: npm run dev"
    echo ""
    exit 1
fi

# Demostrar cambios por año
echo "🔄 Demostrando cambios dinámicos por año:"
echo ""

# Años de demostración
years=(2025 2024 2023 2022 2021 2020)

for year in "${years[@]}"; do
    demo_year $year
    sleep 1  # Pausa para mejor visualización
done

echo "✨ Demo completado!"
echo ""
echo "🌐 Abrir en navegador:"
echo "   Frontend: http://localhost:5173"
echo "   API Docs: http://localhost:3001/api-docs"
echo ""
echo "💡 Prueba cambiar el año en la interfaz para ver los datos actualizarse dinámicamente!"

