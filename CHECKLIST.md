# ✅ Checklist - Balance Chile

## 📋 Antes de Empezar a Desarrollar

- [ ] Node.js 18+ instalado
- [ ] npm instalado
- [ ] Git configurado (opcional)
- [ ] Editor de código (VS Code, etc.)

## 🔧 Configuración Inicial

- [ ] Clonar/descargar el repositorio
- [ ] Navegar a la carpeta `backend/`
- [ ] Ejecutar `npm run install:all`
- [ ] Verificar que `config.env` existe
- [ ] Configurar `USE_REDIS=false` en `config.env`

## 💻 Desarrollo Local

- [ ] Backend inicia correctamente (`npm run dev`)
- [ ] Frontend inicia correctamente (`npm run dev:frontend`)
- [ ] Backend responde en http://localhost:3001/health
- [ ] Frontend carga en http://localhost:5173
- [ ] API docs accesible en http://localhost:3001/api-docs
- [ ] Frontend puede conectarse al backend
- [ ] No hay errores de Redis en la consola

## 🧪 Testing (Opcional)

- [ ] Tests del backend pasan (`npm test`)
- [ ] Tests del frontend pasan (`cd client && npm test`)
- [ ] No hay errores de linting

## 📦 Build de Producción

- [ ] `npm run build` ejecuta sin errores
- [ ] Carpeta `client/dist/` se crea correctamente
- [ ] `client/dist/index.html` existe
- [ ] Assets (JS, CSS) están en `client/dist/assets/`

## 🚀 Prueba Local de Producción

- [ ] `NODE_ENV=production npm start` inicia correctamente
- [ ] Frontend carga en http://localhost:3001
- [ ] API funciona en http://localhost:3001/api
- [ ] Rutas de React Router funcionan (refresh en cualquier ruta)
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores de CORS

## 📤 Preparación para Despliegue

- [ ] `./deploy.sh` ejecuta sin errores
- [ ] `deploy-info.txt` se genera
- [ ] (Opcional) `balance-chile-deploy.tar.gz` se crea
- [ ] `config.env.production` está configurado correctamente
- [ ] Documentación revisada (DEPLOY_CPANEL.md)

## 🌐 Despliegue en cPanel

### Subida de Archivos

- [ ] Archivos subidos al servidor:
  - [ ] `src/` completo
  - [ ] `client/dist/` completo
  - [ ] `package.json`
  - [ ] `package-lock.json`
  - [ ] `config.env` (configurado para producción)

### Configuración en cPanel

- [ ] Aplicación Node.js creada en cPanel
- [ ] Node.js version 18+ seleccionada
- [ ] Application mode: Production
- [ ] Application root configurado
- [ ] Application URL configurado
- [ ] Application startup file: `src/server.js`
- [ ] Variables de entorno configuradas:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=3001` (o el asignado)
  - [ ] `USE_REDIS=false`

### Instalación en Servidor

- [ ] `npm install --production` ejecutado
- [ ] Sin errores de instalación
- [ ] Aplicación iniciada en cPanel
- [ ] Estado: "Running"

## ✅ Verificación Post-Despliegue

### URLs Funcionando

- [ ] https://tudominio.com/ (Frontend carga)
- [ ] https://tudominio.com/health (Retorna JSON OK)
- [ ] https://tudominio.com/api-docs (Swagger carga)
- [ ] https://tudominio.com/api/budget/ministries (Retorna datos)

### Funcionalidad

- [ ] Página principal carga correctamente
- [ ] Navegación entre páginas funciona
- [ ] Datos se cargan desde la API
- [ ] Gráficos se renderizan correctamente
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores 404 en assets
- [ ] Imágenes/iconos cargan correctamente

### Performance y Seguridad

- [ ] Página carga en < 3 segundos
- [ ] HTTPS configurado (SSL activo)
- [ ] Headers de seguridad presentes (Helmet)
- [ ] Rate limiting funciona
- [ ] Caché funciona correctamente

### Mobile y Responsive

- [ ] Sitio se ve bien en móvil
- [ ] Sitio se ve bien en tablet
- [ ] Sitio se ve bien en desktop
- [ ] Navegación funciona en todos los dispositivos

## 🔄 Actualizaciones Futuras

### Checklist para Actualizar

- [ ] Hacer cambios localmente
- [ ] Probar cambios en desarrollo
- [ ] Ejecutar `npm run build`
- [ ] Probar en modo producción local
- [ ] Ejecutar `./deploy.sh`
- [ ] Subir archivos actualizados al servidor
- [ ] Reinstalar dependencias si es necesario
- [ ] Reiniciar aplicación en cPanel
- [ ] Verificar que todo funciona
- [ ] Limpiar caché del navegador si es necesario

## 🐛 Troubleshooting

### Si algo no funciona:

- [ ] Revisar logs del servidor
- [ ] Verificar variables de entorno
- [ ] Verificar permisos de archivos
- [ ] Verificar que todas las dependencias están instaladas
- [ ] Verificar que el puerto está correcto
- [ ] Verificar que NODE_ENV está en production
- [ ] Limpiar caché y reconstruir
- [ ] Reiniciar la aplicación

### Comandos Útiles de Diagnóstico

```bash
# Ver logs
tail -f ~/logs/nodejs.log

# Verificar proceso
ps aux | grep node

# Verificar puerto
netstat -tulpn | grep 3001

# Verificar archivos
ls -la client/dist/

# Verificar variables
cat config.env

# Health check
curl http://localhost:3001/health
```

## 📞 Recursos de Ayuda

- [ ] README.md leído
- [ ] ESTRUCTURA.md consultado
- [ ] DEPLOY_CPANEL.md revisado
- [ ] INICIO_RAPIDO.md consultado
- [ ] Documentación de cPanel del proveedor revisada

## 🎉 ¡Proyecto Completado!

Una vez que todos los checks estén marcados, tu aplicación está lista y funcionando correctamente.

---

**Fecha de última verificación:** _____________

**Notas adicionales:**

_________________________________________________________________

_________________________________________________________________

_________________________________________________________________
