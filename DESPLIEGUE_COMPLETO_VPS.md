# 🚀 Despliegue Completo en VPS - Paso a Paso

## 🔍 Problema Actual

El servidor está sirviendo una versión antigua del HTML que usa CDN en lugar del build de Vite.

**Evidencia:**
```html
<!-- Esto es ANTIGUO ❌ -->
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
```

**Debería ser:**
```html
<!-- Esto es CORRECTO ✅ -->
<script type="module" crossorigin src="/assets/index-9df67f42.js"></script>
<link rel="stylesheet" crossorigin href="/assets/index-a001848c.css">
```

## ✅ Solución Completa

### Paso 1: Conectar al VPS via SSH

```bash
ssh usuario@tu-servidor.com
```

### Paso 2: Ir al Directorio de la Aplicación

```bash
cd /home/nicolic3/balancechile.nicolich.cl
```

### Paso 3: Hacer Pull de los Últimos Cambios

```bash
git pull origin main
```

### Paso 4: Instalar Dependencias del Backend

```bash
npm install
```

Esto instalará:
- cheerio (para BCN)
- express
- cors
- helmet
- morgan
- axios
- redis
- swagger-jsdoc
- swagger-ui-express
- node-cache
- express-rate-limit
- dotenv

### Paso 5: Instalar Dependencias del Frontend

```bash
cd client
npm install
```

### Paso 6: Hacer Build del Frontend

```bash
npm run build
```

Esto generará la carpeta `client/dist/` con:
- `index.html` (correcto, con referencias a assets)
- `assets/index-a001848c.css` (~23.7 KB con Tailwind)
- `assets/index-9df67f42.js` (~743 KB)

### Paso 7: Volver al Directorio Principal

```bash
cd ..
```

### Paso 8: Reiniciar la Aplicación

```bash
touch tmp/restart.txt
```

O si usas PM2:
```bash
pm2 restart balancechile
```

### Paso 9: Verificar que Funciona

```bash
# Ver logs
tail -f logs/error.log

# Probar endpoint
curl http://localhost:3001/health

# Ver el HTML servido
curl http://localhost:3001/ | head -50
```

## 📋 Script Completo (Todo en Uno)

Copia y pega esto en tu terminal SSH:

```bash
#!/bin/bash
set -e

echo "🚀 Iniciando despliegue completo..."

# 1. Ir al directorio
cd /home/nicolic3/balancechile.nicolich.cl
echo "✓ En directorio correcto"

# 2. Pull de cambios
echo "📥 Obteniendo últimos cambios..."
git pull origin main
echo "✓ Código actualizado"

# 3. Instalar dependencias backend
echo "📦 Instalando dependencias backend..."
npm install
echo "✓ Backend dependencies instaladas"

# 4. Instalar dependencias frontend
echo "📦 Instalando dependencias frontend..."
cd client
npm install
echo "✓ Frontend dependencies instaladas"

# 5. Build del frontend
echo "🏗️  Haciendo build del frontend..."
npm run build
echo "✓ Build completado"

# 6. Volver al directorio principal
cd ..

# 7. Verificar archivos generados
echo "🔍 Verificando archivos generados..."
ls -lh client/dist/assets/ | head -5

# 8. Reiniciar aplicación
echo "🔄 Reiniciando aplicación..."
touch tmp/restart.txt
echo "✓ Aplicación reiniciada"

echo ""
echo "✅ ¡DESPLIEGUE COMPLETADO!"
echo ""
echo "Verifica en: https://balancechile.nicolich.cl"
echo ""
```

## 🔍 Verificación Post-Despliegue

### 1. Verificar que el Build se Generó

```bash
ls -la client/dist/
ls -la client/dist/assets/
```

Deberías ver:
```
client/dist/
├── index.html
└── assets/
    ├── index-a001848c.css  (~23.7 KB)
    ├── index-9df67f42.js   (~743 KB)
    └── index-9df67f42.js.map
```

### 2. Verificar el HTML Servido

```bash
curl http://localhost:3001/ | head -30
```

Deberías ver:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Balance Chile</title>
    <script type="module" crossorigin src="/assets/index-9df67f42.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-a001848c.css">
  </head>
```

### 3. Verificar CSS

```bash
curl https://balancechile.nicolich.cl/assets/index-a001848c.css | head -20
```

Deberías ver clases de Tailwind:
```css
@import url(https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap);
*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}
...
```

### 4. Probar en el Navegador

```bash
# Desde tu máquina local
curl -I https://balancechile.nicolich.cl/assets/index-a001848c.css
```

Debería retornar:
```
HTTP/2 200
content-type: text/css
content-length: 23734
```

## ⚠️ Problemas Comunes

### Problema 1: "npm: command not found"

**Solución:**
```bash
# Verificar versión de Node.js
node --version

# Si no está instalado, instalar nvm y Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

### Problema 2: "Permission denied"

**Solución:**
```bash
# Dar permisos al usuario
sudo chown -R $USER:$USER /home/nicolic3/balancechile.nicolich.cl

# O ejecutar con permisos
sudo npm install
```

### Problema 3: "Out of memory"

**Solución:**
```bash
# Aumentar memoria para Node.js
export NODE_OPTIONS="--max-old-space-size=2048"
npm run build
```

### Problema 4: El servidor sigue mostrando HTML antiguo

**Solución:**
```bash
# Verificar que src/server.js está sirviendo client/dist
cat src/server.js | grep -A 5 "express.static"

# Debería mostrar:
# const clientBuildPath = path.join(__dirname, '../client/dist');
# app.use(express.static(clientBuildPath));

# Reiniciar forzado
pkill -f node
touch tmp/restart.txt
```

### Problema 5: "ENOSPC: System limit for number of file watchers reached"

**Solución:**
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## 📊 Estructura Esperada en el Servidor

```
/home/nicolic3/balancechile.nicolich.cl/
├── app.js                          ← Punto de entrada
├── package.json                    ← Dependencias backend
├── node_modules/                   ← Dependencias instaladas
│   └── cheerio/                    ← Debe existir
├── src/
│   ├── server.js                   ← Servidor Express
│   ├── services/
│   │   ├── bcnService.js          ← Servicio BCN
│   │   └── apiService.js
│   └── routes/
├── client/
│   ├── package.json               ← Dependencias frontend
│   ├── node_modules/              ← Dependencias frontend
│   ├── dist/                      ← ✅ BUILD GENERADO
│   │   ├── index.html
│   │   └── assets/
│   │       ├── index-a001848c.css
│   │       └── index-9df67f42.js
│   └── src/
└── tmp/
    └── restart.txt                ← Tocar para reiniciar
```

## ✅ Checklist Final

- [ ] Git pull ejecutado
- [ ] `npm install` en raíz ejecutado
- [ ] `npm install` en client/ ejecutado
- [ ] `npm run build` en client/ ejecutado
- [ ] Carpeta `client/dist/` existe
- [ ] Archivo `client/dist/assets/index-a001848c.css` existe (~23.7 KB)
- [ ] Archivo `client/dist/assets/index-9df67f42.js` existe (~743 KB)
- [ ] Aplicación reiniciada (`touch tmp/restart.txt`)
- [ ] HTML servido contiene referencias a `/assets/index-*.js`
- [ ] CSS se carga correctamente (Status 200)
- [ ] Sitio se ve con estilos modernos de Tailwind

## 🎯 Resultado Esperado

**ANTES (actual):**
```bash
curl https://balancechile.nicolich.cl/ | grep tailwind
# Muestra: <script src="https://cdn.tailwindcss.com"></script>
```

**DESPUÉS (correcto):**
```bash
curl https://balancechile.nicolich.cl/ | grep assets
# Muestra: <link rel="stylesheet" href="/assets/index-a001848c.css">
```

## 📞 Comando de Verificación Rápida

Ejecuta esto para ver si todo está bien:

```bash
cd /home/nicolic3/balancechile.nicolich.cl && \
echo "📁 Verificando estructura..." && \
ls -la client/dist/ && \
echo "" && \
echo "📦 Verificando node_modules..." && \
ls node_modules/ | grep cheerio && \
echo "" && \
echo "🌐 Verificando HTML servido..." && \
curl -s http://localhost:3001/ | grep -E "(assets|tailwind)" | head -5
```

---

**Tiempo estimado:** 5-10 minutos
**Requisitos:** Acceso SSH al VPS
**Resultado:** Sitio con estilos modernos de Tailwind funcionando correctamente
