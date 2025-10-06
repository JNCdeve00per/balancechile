#!/bin/bash

# Script de despliegue para Balance Chile
# Este script prepara el proyecto para ser desplegado en cPanel

echo "🚀 Iniciando proceso de despliegue..."

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: No se encuentra package.json${NC}"
    echo "Asegúrate de ejecutar este script desde el directorio backend/"
    exit 1
fi

# 2. Instalar dependencias del backend
echo -e "${YELLOW}📦 Instalando dependencias del backend...${NC}"
npm install --production
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error instalando dependencias del backend${NC}"
    exit 1
fi

# 3. Instalar dependencias del frontend
echo -e "${YELLOW}📦 Instalando dependencias del frontend...${NC}"
cd client
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error instalando dependencias del frontend${NC}"
    exit 1
fi

# 4. Construir el frontend
echo -e "${YELLOW}🏗️  Construyendo frontend...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error construyendo el frontend${NC}"
    exit 1
fi

cd ..

# 5. Verificar que el build se creó correctamente
if [ ! -d "client/dist" ]; then
    echo -e "${RED}❌ Error: No se generó la carpeta client/dist${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completado exitosamente${NC}"

# 6. Crear archivo de información de despliegue
echo -e "${YELLOW}📝 Creando información de despliegue...${NC}"
cat > deploy-info.txt << EOF
Balance Chile - Información de Despliegue
==========================================

Fecha de build: $(date)
Node version: $(node --version)
NPM version: $(npm --version)

Archivos importantes para subir a cPanel:
------------------------------------------
1. src/ (todo el directorio)
2. client/dist/ (archivos construidos del frontend)
3. package.json
4. package-lock.json
5. config.env (configurado para producción)

Opcional (si no instalas en el servidor):
6. node_modules/ (puede ser muy grande, mejor instalar en servidor)

Configuración requerida en cPanel:
-----------------------------------
1. Setup Node.js App:
   - Application root: /home/usuario/tu-directorio
   - Application URL: tu dominio
   - Application startup file: src/server.js
   - Node.js version: 18.x o superior
   - Application mode: Production

2. Variables de entorno:
   NODE_ENV=production
   PORT=3001 (o el que asigne cPanel)
   USE_REDIS=false

3. Comando para instalar dependencias en servidor:
   npm install --production

4. Iniciar aplicación desde cPanel

URLs de la aplicación:
----------------------
- Frontend: https://tudominio.com/
- API: https://tudominio.com/api/
- Docs: https://tudominio.com/api-docs
- Health: https://tudominio.com/health

EOF

echo -e "${GREEN}✅ Información guardada en deploy-info.txt${NC}"

# 7. Mostrar resumen
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Proyecto listo para desplegar${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Próximos pasos:"
echo "1. Sube los archivos a tu servidor cPanel"
echo "2. Configura la aplicación Node.js en cPanel"
echo "3. Instala dependencias: npm install --production"
echo "4. Inicia la aplicación"
echo ""
echo "Para más detalles, consulta README.md y deploy-info.txt"
echo ""

# 8. Opcional: Crear archivo comprimido para subir
read -p "¿Deseas crear un archivo .tar.gz para subir fácilmente? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo -e "${YELLOW}📦 Creando archivo comprimido...${NC}"
    
    # Crear lista de archivos a incluir
    tar -czf balance-chile-deploy.tar.gz \
        src/ \
        client/dist/ \
        package.json \
        package-lock.json \
        config.env \
        deploy-info.txt \
        README.md \
        --exclude='*.log' \
        --exclude='.git' \
        --exclude='node_modules'
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Archivo creado: balance-chile-deploy.tar.gz${NC}"
        echo "Puedes subir este archivo a tu servidor y descomprimirlo con:"
        echo "tar -xzf balance-chile-deploy.tar.gz"
    else
        echo -e "${RED}❌ Error creando archivo comprimido${NC}"
    fi
fi

echo ""
echo -e "${GREEN}🎉 ¡Listo!${NC}"
