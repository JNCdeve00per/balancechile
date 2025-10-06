# 🚀 Inicio Rápido - Balance Chile

Guía rápida para empezar a trabajar con el proyecto.

## ⚡ Instalación Rápida

```bash
# 1. Clonar el repositorio (si aún no lo has hecho)
git clone https://github.com/tu-usuario/balanceChile.git
cd balanceChile

# 2. Instalar todas las dependencias
npm run install:all

# 3. Iniciar en modo desarrollo
./start-dev.sh
```

¡Listo! La aplicación estará corriendo en:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- API Docs: http://localhost:3001/api-docs

## 📋 Comandos Útiles

### Desarrollo

```bash
# Iniciar backend y frontend juntos (recomendado)
./start-dev.sh

# O iniciarlos por separado:
npm run dev              # Backend en puerto 3001
npm run dev:frontend     # Frontend en puerto 5173
```

### Producción

```bash
# 1. Construir el frontend
npm run build

# 2. Iniciar en modo producción
NODE_ENV=production npm start

# La app estará en: http://localhost:3001
```

### Despliegue

```bash
# Preparar para desplegar en cPanel
./deploy.sh

# Esto genera balance-chile-deploy.tar.gz
# Sube este archivo a tu servidor
```

## 📁 Estructura Simplificada

```
balanceChile/
├── client/              # Frontend React
│   ├── src/            # Código fuente
│   └── dist/           # Build de producción
├── src/                # Backend Node.js
│   ├── routes/         # Rutas API
│   ├── services/       # Lógica de negocio
│   └── server.js       # Servidor principal
├── app.js              # Punto de entrada
├── config.env          # Variables de entorno
└── package.json        # Dependencias y scripts
```

## 🔧 Configuración

### Variables de Entorno (`config.env`)

```env
NODE_ENV=development
PORT=3001
USE_REDIS=false
```

Para producción, copia `config.env.production` como `config.env`.

## 🌐 URLs Importantes

### Desarrollo
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001/api
- **API Docs:** http://localhost:3001/api-docs
- **Health Check:** http://localhost:3001/health

### Producción
- **Todo en uno:** https://tudominio.com
- **API:** https://tudominio.com/api
- **Docs:** https://tudominio.com/api-docs

## 📚 Documentación Completa

- **README.md** - Documentación principal
- **ESTRUCTURA.md** - Estructura del proyecto
- **DEPLOY_CPANEL.md** - Guía de despliegue en cPanel

## 🐛 Solución Rápida de Problemas

### Error: "Cannot find module"
```bash
npm run install:all
```

### Error: "Port already in use"
```bash
# Cambiar puerto en config.env
PORT=3002
```

### Frontend no conecta con backend
```bash
# Verificar que el backend esté corriendo
curl http://localhost:3001/health
```

### Errores de Redis
```bash
# Ya está desactivado, pero si ves errores:
# Verificar que USE_REDIS=false en config.env
```

## 🎯 Próximos Pasos

1. **Desarrollo:**
   - Modifica componentes en `client/src/`
   - Modifica rutas API en `src/routes/`
   - Los cambios se recargan automáticamente

2. **Antes de Desplegar:**
   - Ejecutar `npm run build`
   - Probar en modo producción localmente
   - Ejecutar `./deploy.sh`

3. **Desplegar:**
   - Seguir guía en `DEPLOY_CPANEL.md`
   - Subir archivos al servidor
   - Configurar en cPanel

## ✨ Características

✅ React + Vite (frontend rápido)
✅ Express + Node.js (backend robusto)
✅ Caché en memoria (sin Redis)
✅ API REST documentada (Swagger)
✅ Rate limiting incluido
✅ Listo para cPanel
✅ Un solo servidor en producción

## 🤝 Ayuda

Si tienes problemas:
1. Revisa los logs en la terminal
2. Consulta la documentación completa
3. Verifica que todas las dependencias estén instaladas

---

**¡Feliz desarrollo! 🎉**
