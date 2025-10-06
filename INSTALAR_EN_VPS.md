# 🚀 Instalar Dependencias en VPS

## ❌ Error Actual

```
Error: Cannot find module 'cheerio'
```

Este error ocurre porque las dependencias de Node.js no están instaladas en el servidor.

## ✅ Solución

### Opción 1: Instalar via SSH (Recomendado)

Si tienes acceso SSH al VPS:

```bash
# 1. Conectar al VPS
ssh usuario@tu-servidor.com

# 2. Ir al directorio de la aplicación
cd /home/nicolic3/balancechile.nicolich.cl

# 3. Instalar dependencias
npm install

# 4. Reiniciar la aplicación
touch tmp/restart.txt
# O si usas PM2:
# pm2 restart balancechile
```

### Opción 2: Via Terminal Web de cPanel/Hosting

Si tu hosting tiene terminal web:

1. **Ir a Terminal en cPanel**
2. **Ejecutar:**
   ```bash
   cd balancechile.nicolich.cl
   npm install
   touch tmp/restart.txt
   ```

### Opción 3: Subir node_modules (No recomendado pero funciona)

Si no tienes acceso a terminal:

1. **En tu máquina local:**
   ```bash
   cd /Users/jnicolich/balanceChile
   
   # Instalar dependencias de producción
   npm install --production
   
   # Crear ZIP incluyendo node_modules
   zip -r balancechile-con-deps.zip . \
     -x ".git/*" \
     -x "client/node_modules/*" \
     -x "*.log" \
     -x ".DS_Store"
   ```

2. **Subir y extraer en el servidor**

## 📋 Verificar Instalación

Después de instalar, verifica que `cheerio` esté presente:

```bash
# En el servidor
cd /home/nicolic3/balancechile.nicolich.cl
ls node_modules/ | grep cheerio
```

Deberías ver:
```
cheerio
```

## 🔧 Comandos Completos para VPS

Copia y pega estos comandos en tu terminal SSH:

```bash
# Ir al directorio
cd /home/nicolic3/balancechile.nicolich.cl

# Ver si existe package.json
ls -la package.json

# Instalar todas las dependencias
npm install

# Verificar que cheerio se instaló
ls node_modules/ | grep cheerio

# Reiniciar la aplicación (LiteSpeed)
touch tmp/restart.txt

# Ver si hay errores
tail -f logs/error.log
```

## 📦 Dependencias que se Instalarán

El `package.json` incluye:

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "axios": "^1.6.0",
    "cheerio": "^1.1.2",        ← Esta falta
    "redis": "^4.6.10",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0",
    "node-cache": "^5.1.2",
    "express-rate-limit": "^7.1.5",
    "dotenv": "^16.3.1"
  }
}
```

## ⚠️ Notas Importantes

### 1. Node.js Version

Tu VPS tiene Node.js v20.19.4, que es compatible con cheerio.

### 2. Permisos

Si tienes problemas de permisos:

```bash
# Dar permisos al usuario
sudo chown -R nicolic3:nicolic3 /home/nicolic3/balancechile.nicolich.cl

# O instalar con --unsafe-perm si es necesario
npm install --unsafe-perm
```

### 3. Memoria

Si el servidor tiene poca memoria y falla la instalación:

```bash
# Instalar sin scripts opcionales
npm install --no-optional

# O instalar solo producción
npm install --production
```

## 🚨 Si Persiste el Error

### Verificar que Git Pull funcionó:

```bash
cd /home/nicolic3/balancechile.nicolich.cl

# Ver últimos commits
git log -3

# Ver archivos modificados
git status

# Verificar que bcnService.js existe
ls -la src/services/bcnService.js
```

### Reinstalar desde cero:

```bash
cd /home/nicolic3/balancechile.nicolich.cl

# Limpiar todo
rm -rf node_modules package-lock.json

# Pull fresco
git pull origin main

# Reinstalar
npm install

# Reiniciar
touch tmp/restart.txt
```

## ✅ Confirmación

Después de instalar, tu aplicación debería iniciar sin errores. Verifica:

```bash
# Ver logs en tiempo real
tail -f logs/error.log

# O ver el último error
tail -20 logs/error.log
```

Deberías ver:
```
🚀 Server running on port 3001
📚 API Documentation: http://localhost:3001/api-docs
🏥 Health Check: http://localhost:3001/health
```

## 🎯 Resumen Rápido

**El comando más importante:**

```bash
cd /home/nicolic3/balancechile.nicolich.cl && npm install && touch tmp/restart.txt
```

Esto:
1. Va al directorio correcto
2. Instala todas las dependencias (incluyendo cheerio)
3. Reinicia la aplicación

---

**¿Necesitas acceso SSH?** Contacta a tu proveedor de hosting para obtener credenciales SSH.
