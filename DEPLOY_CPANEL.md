# Guía de Despliegue en cPanel

Esta guía te ayudará a desplegar Balance Chile en un servidor con cPanel.

## 📋 Requisitos Previos

- Acceso a cPanel con soporte para Node.js
- Node.js 18.x o superior disponible en el servidor
- Acceso SSH (opcional, pero recomendado)
- Cliente FTP o acceso al File Manager de cPanel

## 🚀 Proceso de Despliegue

### Paso 1: Preparar el Proyecto Localmente

```bash
# Navegar al directorio del proyecto
cd backend

# Ejecutar el script de despliegue
./deploy.sh
```

Este script:
- Instala todas las dependencias
- Construye el frontend
- Crea un archivo comprimido (opcional)
- Genera información de despliegue

### Paso 2: Subir Archivos al Servidor

#### Opción A: Usando el archivo comprimido (Recomendado)

1. Si creaste el archivo `balance-chile-deploy.tar.gz`:
   ```bash
   # Subir el archivo por FTP o File Manager
   ```

2. Conectar por SSH y descomprimir:
   ```bash
   cd ~/tu-directorio-app
   tar -xzf balance-chile-deploy.tar.gz
   ```

#### Opción B: Subir archivos directamente

Subir estos archivos/carpetas vía FTP o File Manager:

```
✅ src/                    (todo el directorio)
✅ client/dist/            (archivos construidos)
✅ package.json
✅ package-lock.json
✅ config.env              (configurado para producción)
✅ README.md               (opcional)
```

**NO subir:**
- `node_modules/` (se instalará en el servidor)
- `client/node_modules/`
- `client/src/` (no necesario, ya está en dist/)
- `.git/`

### Paso 3: Configurar Variables de Entorno

1. Editar `config.env` en el servidor:

```env
NODE_ENV=production
PORT=3001
USE_REDIS=false
API_CACHE_TTL=3600
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

**Importante:** Ajusta el `PORT` según lo que te asigne cPanel.

### Paso 4: Configurar Node.js App en cPanel

1. **Ir a "Setup Node.js App"** en cPanel

2. **Crear Nueva Aplicación:**
   - **Node.js version:** 18.x o superior
   - **Application mode:** Production
   - **Application root:** `/home/usuario/balance-chile` (tu ruta)
   - **Application URL:** Tu dominio (ej: `balancechile.nicolich.cl`)
   - **Application startup file:** `src/server.js`

3. **Variables de Entorno** (agregar en la interfaz):
   ```
   NODE_ENV=production
   PORT=3001
   ```

4. **Guardar** la configuración

### Paso 5: Instalar Dependencias

En la interfaz de "Setup Node.js App" de cPanel:

1. Buscar la sección de comandos
2. Ejecutar:
   ```bash
   npm install --production
   ```

O si tienes acceso SSH:
```bash
cd ~/balance-chile
source ~/nodevenv/balance-chile/18/bin/activate
npm install --production
```

### Paso 6: Iniciar la Aplicación

1. En "Setup Node.js App", hacer clic en **"Start App"** o **"Restart App"**

2. Verificar que el estado sea "Running"

### Paso 7: Verificar el Despliegue

Visita las siguientes URLs para verificar:

- ✅ `https://tudominio.com/` → Debe cargar el frontend React
- ✅ `https://tudominio.com/health` → Debe retornar JSON con status OK
- ✅ `https://tudominio.com/api-docs` → Debe mostrar la documentación Swagger
- ✅ `https://tudominio.com/api/budget/ministries?year=2024` → Debe retornar datos

## 🔧 Configuración Adicional (Opcional)

### Configurar Dominio Personalizado

Si usas un subdominio o dominio personalizado:

1. En cPanel, ir a **"Domains"** o **"Subdomains"**
2. Agregar el dominio/subdominio
3. Apuntarlo al directorio de la aplicación
4. En "Setup Node.js App", actualizar el **Application URL**

### Configurar SSL/HTTPS

1. En cPanel, ir a **"SSL/TLS Status"**
2. Activar SSL para tu dominio
3. O usar **Let's Encrypt** si está disponible

### Configurar .htaccess (si es necesario)

Si cPanel no maneja automáticamente el proxy:

```bash
# Copiar el archivo de ejemplo
cp .htaccess.example .htaccess

# Editar y ajustar el puerto si es necesario
nano .htaccess
```

## 🐛 Solución de Problemas

### La aplicación no inicia

1. **Verificar logs:**
   - En cPanel → "Setup Node.js App" → Ver logs
   - O por SSH: `tail -f ~/logs/nodejs.log`

2. **Verificar puerto:**
   ```bash
   # El puerto en config.env debe coincidir con el de cPanel
   ```

3. **Verificar permisos:**
   ```bash
   chmod -R 755 ~/balance-chile
   ```

### El frontend no carga

1. **Verificar que existe `client/dist/`:**
   ```bash
   ls -la client/dist/
   ```

2. **Verificar NODE_ENV:**
   ```bash
   echo $NODE_ENV  # Debe ser "production"
   ```

3. **Reconstruir el frontend:**
   ```bash
   cd client
   npm run build
   ```

### Errores de API

1. **Verificar conectividad a APIs externas:**
   ```bash
   curl https://datos.gob.cl/api/3/action
   ```

2. **Verificar logs del servidor:**
   ```bash
   tail -f ~/logs/nodejs.log
   ```

3. **Verificar variables de entorno:**
   ```bash
   cat config.env
   ```

### Error "Cannot find module"

```bash
# Reinstalar dependencias
rm -rf node_modules
npm install --production
```

### Puerto en uso

```bash
# Cambiar el puerto en config.env y en cPanel
# Luego reiniciar la aplicación
```

## 🔄 Actualizar la Aplicación

Para actualizar después del primer despliegue:

```bash
# 1. Local: Construir nueva versión
./deploy.sh

# 2. Subir archivos actualizados:
#    - src/ (si hubo cambios en backend)
#    - client/dist/ (si hubo cambios en frontend)

# 3. En el servidor (por SSH):
cd ~/balance-chile
source ~/nodevenv/balance-chile/18/bin/activate

# 4. Si hubo cambios en dependencias:
npm install --production

# 5. Reiniciar la aplicación en cPanel
```

## 📊 Monitoreo

### Ver logs en tiempo real

```bash
# Por SSH
tail -f ~/logs/nodejs.log
```

### Verificar estado de la aplicación

```bash
# Health check
curl https://tudominio.com/health
```

### Reiniciar la aplicación

- Desde cPanel: "Setup Node.js App" → "Restart"
- Por SSH: Usar el comando de restart que proporciona cPanel

## 🔐 Seguridad

1. **Nunca subir archivos sensibles:**
   - No subir `.env` con credenciales
   - No subir archivos de configuración local

2. **Mantener dependencias actualizadas:**
   ```bash
   npm audit
   npm audit fix
   ```

3. **Usar HTTPS:**
   - Siempre configurar SSL/TLS
   - Forzar HTTPS en producción

4. **Rate Limiting:**
   - Ya está configurado en el código
   - Ajustar según necesidades en `config.env`

## 📞 Soporte

Si encuentras problemas:

1. Revisar los logs del servidor
2. Verificar la documentación de cPanel de tu proveedor
3. Consultar el README.md principal
4. Revisar los issues en el repositorio

## ✅ Checklist de Despliegue

- [ ] Ejecutar `./deploy.sh` localmente
- [ ] Subir archivos al servidor
- [ ] Configurar `config.env` para producción
- [ ] Crear aplicación Node.js en cPanel
- [ ] Instalar dependencias con `npm install --production`
- [ ] Configurar variables de entorno en cPanel
- [ ] Iniciar la aplicación
- [ ] Verificar `https://tudominio.com/health`
- [ ] Verificar que el frontend carga correctamente
- [ ] Verificar que las APIs funcionan
- [ ] Configurar SSL/HTTPS
- [ ] Probar todas las funcionalidades

¡Listo! Tu aplicación debería estar corriendo en producción. 🎉
