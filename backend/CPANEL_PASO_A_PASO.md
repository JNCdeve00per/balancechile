# 🎯 cPanel - Configuración Paso a Paso

Guía visual detallada para configurar Balance Chile en cPanel.

## 📋 Requisitos Previos

- [ ] Acceso a cPanel
- [ ] Node.js disponible en tu hosting (versión 18+)
- [ ] Archivos del proyecto listos (ejecutaste `./deploy.sh`)

## 🚀 Paso 1: Subir Archivos al Servidor

### Opción A: Usando File Manager

1. **Abrir File Manager en cPanel**
   - Buscar "File Manager" en cPanel
   - Click en "File Manager"

2. **Navegar al directorio de tu aplicación**
   ```
   /home/tu_usuario/balance-chile/
   ```
   (Crea el directorio si no existe)

3. **Subir archivos**
   - Click en "Upload" en la barra superior
   - Subir `balance-chile-deploy.tar.gz`
   - Esperar a que termine la subida

4. **Extraer archivos**
   - Volver a File Manager
   - Click derecho en `balance-chile-deploy.tar.gz`
   - Seleccionar "Extract"
   - Confirmar

### Opción B: Usando FTP

1. **Conectar con tu cliente FTP favorito**
   - Host: ftp.tudominio.com
   - Usuario: tu usuario de cPanel
   - Contraseña: tu contraseña de cPanel

2. **Navegar a tu directorio**
   ```
   /home/tu_usuario/balance-chile/
   ```

3. **Subir archivos necesarios:**
   ```
   ✅ src/ (toda la carpeta)
   ✅ client/dist/ (toda la carpeta)
   ✅ package.json
   ✅ package-lock.json
   ✅ config.env
   ```

## 🔧 Paso 2: Configurar Variables de Entorno

1. **Editar config.env**
   - En File Manager, navegar a tu directorio
   - Click derecho en `config.env`
   - Seleccionar "Edit"

2. **Configurar para producción:**
   ```env
   NODE_ENV=production
   PORT=3001
   USE_REDIS=false
   API_CACHE_TTL=3600
   RATE_LIMIT_WINDOW=900000
   RATE_LIMIT_MAX=100
   ```

3. **Guardar cambios**
   - Click en "Save Changes"

## 📦 Paso 3: Configurar Node.js App

1. **Buscar "Setup Node.js App" en cPanel**
   - En el buscador de cPanel, escribir "node"
   - Click en "Setup Node.js App"

2. **Crear Nueva Aplicación**
   - Click en "Create Application"

3. **Configurar la aplicación:**

   ```
   ┌─────────────────────────────────────────┐
   │ Node.js version: 18.x o superior        │
   ├─────────────────────────────────────────┤
   │ Application mode: Production            │
   ├─────────────────────────────────────────┤
   │ Application root:                       │
   │ /home/tu_usuario/balance-chile          │
   ├─────────────────────────────────────────┤
   │ Application URL:                        │
   │ https://tudominio.com                   │
   ├─────────────────────────────────────────┤
   │ Application startup file:               │
   │ src/server.js                           │
   ├─────────────────────────────────────────┤
   │ Passenger log file: (dejar por defecto) │
   └─────────────────────────────────────────┘
   ```

4. **Agregar Variables de Entorno**
   
   En la sección "Environment variables", agregar:
   
   ```
   Variable Name: NODE_ENV
   Value: production
   [Add]
   
   Variable Name: PORT
   Value: 3001
   [Add]
   
   Variable Name: USE_REDIS
   Value: false
   [Add]
   ```

5. **Guardar configuración**
   - Click en "Create"

## 📥 Paso 4: Instalar Dependencias

1. **Copiar el comando de instalación**
   
   Después de crear la app, cPanel mostrará algo como:
   ```bash
   source /home/tu_usuario/nodevenv/balance-chile/18/bin/activate && cd /home/tu_usuario/balance-chile
   ```

2. **Abrir Terminal en cPanel**
   - Buscar "Terminal" en cPanel
   - Click en "Terminal"

3. **Activar el entorno Node.js**
   ```bash
   source /home/tu_usuario/nodevenv/balance-chile/18/bin/activate
   ```

4. **Navegar al directorio**
   ```bash
   cd /home/tu_usuario/balance-chile
   ```

5. **Instalar dependencias**
   ```bash
   npm install --production
   ```

6. **Esperar a que termine**
   - Puede tomar varios minutos
   - Verás mensajes de instalación

7. **Verificar instalación**
   ```bash
   ls -la node_modules/
   ```
   Deberías ver las carpetas de las dependencias

## ▶️ Paso 5: Iniciar la Aplicación

1. **Volver a "Setup Node.js App"**
   - Buscar tu aplicación en la lista

2. **Iniciar la aplicación**
   - Click en "Start App" o el botón de play ▶️
   - El estado debe cambiar a "Running" 🟢

3. **Verificar que está corriendo**
   - El indicador debe estar verde
   - No debe haber errores visibles

## ✅ Paso 6: Verificar el Despliegue

### Verificación Básica

1. **Abrir tu sitio web**
   ```
   https://tudominio.com/
   ```
   - Debe cargar el frontend de React
   - No debe haber errores 404

2. **Verificar Health Check**
   ```
   https://tudominio.com/health
   ```
   - Debe retornar:
   ```json
   {
     "status": "OK",
     "timestamp": "...",
     "uptime": ...
   }
   ```

3. **Verificar API**
   ```
   https://tudominio.com/api/budget/ministries?year=2024
   ```
   - Debe retornar datos JSON

4. **Verificar Documentación**
   ```
   https://tudominio.com/api-docs
   ```
   - Debe cargar Swagger UI

### Verificación Completa

- [ ] Página principal carga
- [ ] Navegación funciona
- [ ] Datos se muestran correctamente
- [ ] Gráficos se renderizan
- [ ] No hay errores en consola del navegador
- [ ] SSL/HTTPS funciona
- [ ] Todas las rutas funcionan (refresh en cualquier página)

## 🔍 Paso 7: Ver Logs (Si hay problemas)

1. **En "Setup Node.js App"**
   - Click en tu aplicación
   - Buscar "Log file"
   - Click para ver los logs

2. **Por Terminal**
   ```bash
   tail -f ~/logs/nodejs.log
   ```

3. **Ver errores recientes**
   ```bash
   tail -100 ~/logs/nodejs.log | grep -i error
   ```

## 🐛 Solución de Problemas Comunes

### Problema 1: "Application failed to start"

**Solución:**
```bash
# Verificar que src/server.js existe
ls -la src/server.js

# Verificar permisos
chmod 755 src/server.js

# Verificar sintaxis
node -c src/server.js

# Reintentar
```

### Problema 2: "Cannot find module"

**Solución:**
```bash
# Reinstalar dependencias
cd /home/tu_usuario/balance-chile
source /home/tu_usuario/nodevenv/balance-chile/18/bin/activate
rm -rf node_modules
npm install --production
```

### Problema 3: "Port already in use"

**Solución:**
1. Cambiar el puerto en `config.env`
2. Actualizar la variable de entorno en cPanel
3. Reiniciar la aplicación

### Problema 4: Frontend no carga (404)

**Solución:**
```bash
# Verificar que client/dist existe
ls -la client/dist/

# Si no existe, construir localmente y subir
npm run build
# Luego subir la carpeta client/dist/
```

### Problema 5: API no responde

**Solución:**
```bash
# Verificar que el servidor está corriendo
curl http://localhost:3001/health

# Verificar logs
tail -50 ~/logs/nodejs.log

# Verificar config.env
cat config.env
```

## 🔄 Actualizar la Aplicación

Cuando necesites actualizar:

1. **Construir nueva versión localmente**
   ```bash
   ./deploy.sh
   ```

2. **Detener la aplicación en cPanel**
   - "Setup Node.js App" → "Stop App"

3. **Subir archivos actualizados**
   - Solo los que cambiaron (src/ o client/dist/)

4. **Si hay nuevas dependencias**
   ```bash
   npm install --production
   ```

5. **Reiniciar la aplicación**
   - "Setup Node.js App" → "Restart App"

6. **Verificar**
   - Visitar el sitio
   - Verificar que los cambios están activos

## 📊 Panel de Control

### Comandos Útiles en Terminal

```bash
# Activar entorno Node.js
source /home/tu_usuario/nodevenv/balance-chile/18/bin/activate

# Ver versión de Node
node --version

# Ver procesos Node
ps aux | grep node

# Ver uso de memoria
free -h

# Ver espacio en disco
df -h

# Ver logs en tiempo real
tail -f ~/logs/nodejs.log

# Buscar errores
grep -i error ~/logs/nodejs.log
```

### Información de la Aplicación

Para ver información de tu app:

```bash
cd /home/tu_usuario/balance-chile
cat package.json | grep version
cat config.env
```

## 🎉 ¡Listo!

Si todos los pasos se completaron exitosamente, tu aplicación está corriendo en producción.

### URLs Finales

- 🌐 **Sitio Web:** https://tudominio.com
- 📊 **API:** https://tudominio.com/api
- 📚 **Docs:** https://tudominio.com/api-docs
- 🏥 **Health:** https://tudominio.com/health

### Próximos Pasos

- Configurar dominio personalizado (si aplica)
- Configurar SSL/HTTPS (Let's Encrypt)
- Configurar backups automáticos
- Monitorear logs regularmente
- Mantener dependencias actualizadas

---

**¿Necesitas ayuda?**
- Consulta los logs
- Revisa DEPLOY_CPANEL.md
- Contacta al soporte de tu hosting
