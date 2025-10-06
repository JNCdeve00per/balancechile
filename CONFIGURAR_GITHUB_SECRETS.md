# 🔑 Configurar GitHub Secrets para Deployment

## ❌ Error Actual

```
Error: can't connect without a private SSH key or password
```

**Causa:** Los secrets de GitHub no están configurados o están incompletos.

## ✅ Solución: Configurar Secrets en GitHub

### Paso 1: Ir a la Configuración de Secrets

1. Ve a tu repositorio en GitHub: https://github.com/JNCdeve00per/balancechile
2. Click en **Settings** (⚙️)
3. En el menú lateral izquierdo, busca **Secrets and variables**
4. Click en **Actions**
5. Click en **New repository secret**

### Paso 2: Agregar los Secrets Necesarios

Necesitas agregar **4 secrets**:

#### 1. VPS_HOST
- **Name:** `VPS_HOST`
- **Value:** Tu dominio o IP del servidor
  ```
  balancechile.nicolich.cl
  ```
  O la IP:
  ```
  123.456.789.012
  ```

#### 2. VPS_USERNAME
- **Name:** `VPS_USERNAME`
- **Value:** Tu usuario SSH
  ```
  nicolic3
  ```

#### 3. VPS_SSH_KEY
- **Name:** `VPS_SSH_KEY`
- **Value:** Tu clave privada SSH **COMPLETA**

**¿Cómo obtener tu clave SSH privada?**

En tu máquina local (Mac):

```bash
# Ver tu clave privada
cat ~/.ssh/id_rsa

# O si usas ed25519:
cat ~/.ssh/id_ed25519
```

Copia **TODO** el contenido, incluyendo:
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
... (muchas líneas) ...
-----END OPENSSH PRIVATE KEY-----
```

⚠️ **IMPORTANTE:** 
- Copia TODO desde `-----BEGIN` hasta `-----END`
- Incluye todas las líneas
- NO compartas esta clave públicamente

#### 4. VPS_PORT
- **Name:** `VPS_PORT`
- **Value:** Puerto SSH (usualmente 22)
  ```
  22
  ```

### Paso 3: Verificar que los Secrets Están Configurados

Después de agregar los 4 secrets, deberías ver:

```
VPS_HOST          Updated X minutes ago
VPS_USERNAME      Updated X minutes ago
VPS_SSH_KEY       Updated X minutes ago
VPS_PORT          Updated X minutes ago
```

## 🔐 Si No Tienes Clave SSH

### Opción 1: Crear una Nueva Clave SSH

En tu máquina local:

```bash
# Generar nueva clave SSH
ssh-keygen -t ed25519 -C "tu-email@ejemplo.com"

# Presiona Enter para usar la ubicación por defecto
# Presiona Enter para no usar passphrase (o ingresa una)

# Copiar la clave pública al servidor
ssh-copy-id nicolic3@balancechile.nicolich.cl

# Ver la clave privada para copiarla a GitHub
cat ~/.ssh/id_ed25519
```

### Opción 2: Usar Clave Existente del Hosting

Si tu hosting te proporcionó una clave SSH:

1. Descarga la clave privada desde tu panel de hosting
2. Abre el archivo con un editor de texto
3. Copia TODO el contenido
4. Pégalo en el secret `VPS_SSH_KEY`

### Opción 3: Usar Password (No Recomendado)

Si prefieres usar password en lugar de clave SSH, modifica el workflow:

```yaml
# En .github/workflows/deploy.yml
# Reemplaza:
key: ${{ secrets.VPS_SSH_KEY }}

# Por:
password: ${{ secrets.VPS_PASSWORD }}
```

Y agrega el secret:
- **Name:** `VPS_PASSWORD`
- **Value:** Tu contraseña SSH

## 🧪 Probar la Conexión SSH

Antes de configurar GitHub, prueba que puedes conectarte:

```bash
# Desde tu máquina local
ssh nicolic3@balancechile.nicolich.cl

# Si funciona, deberías ver:
# Welcome to...
# nicolic3@servidor:~$
```

Si la conexión funciona, entonces la clave SSH es correcta.

## 🔄 Después de Configurar los Secrets

### Opción 1: Ejecutar el Workflow Manualmente

1. Ve a GitHub → **Actions**
2. Click en **Deploy to VPS** (en el menú lateral)
3. Click en **Run workflow** (botón azul)
4. Selecciona branch **main**
5. Click **Run workflow**

### Opción 2: Hacer un Nuevo Push

```bash
# Hacer un cambio pequeño
echo "" >> README.md

# Commit y push
git add README.md
git commit -m "Trigger deployment"
git push origin main
```

## 📊 Verificar que Funcionó

Después de configurar los secrets y ejecutar el workflow:

1. Ve a **GitHub → Actions**
2. Click en el workflow en ejecución
3. Deberías ver:
   ```
   ✅ Checkout code
   ✅ Setup Node.js
   ✅ Install Backend Dependencies
   ✅ Install Frontend Dependencies
   ✅ Build Frontend
   ✅ Prepare deployment files
   ✅ Copy files to VPS          ← Ahora debería funcionar
   ✅ Deploy to VPS
   ```

## 🚨 Solución de Problemas

### Error: "Permission denied (publickey)"

**Solución:**
1. Verifica que la clave SSH es correcta
2. Asegúrate de copiar TODO el contenido (incluyendo BEGIN y END)
3. Verifica que el usuario es correcto (`nicolic3`)

### Error: "Host key verification failed"

**Solución:**
Agrega esto al workflow antes de la conexión SSH:

```yaml
- name: Add SSH key
  run: |
    mkdir -p ~/.ssh
    echo "${{ secrets.VPS_SSH_KEY }}" > ~/.ssh/id_rsa
    chmod 600 ~/.ssh/id_rsa
    ssh-keyscan -H ${{ secrets.VPS_HOST }} >> ~/.ssh/known_hosts
```

### Error: "Connection timed out"

**Solución:**
1. Verifica que el puerto SSH es correcto (usualmente 22)
2. Verifica que el firewall del servidor permite conexiones SSH
3. Verifica que el host es correcto (dominio o IP)

## 📝 Checklist

- [ ] VPS_HOST configurado
- [ ] VPS_USERNAME configurado
- [ ] VPS_SSH_KEY configurado (clave completa)
- [ ] VPS_PORT configurado
- [ ] Conexión SSH probada desde tu máquina
- [ ] Workflow ejecutado manualmente
- [ ] Deployment exitoso

## 🎯 Resumen Rápido

```bash
# 1. Obtener clave SSH
cat ~/.ssh/id_rsa

# 2. Ir a GitHub Settings → Secrets → Actions

# 3. Agregar 4 secrets:
#    - VPS_HOST: balancechile.nicolich.cl
#    - VPS_USERNAME: nicolic3
#    - VPS_SSH_KEY: (contenido completo de la clave)
#    - VPS_PORT: 22

# 4. Ejecutar workflow manualmente o hacer push

# 5. Verificar en GitHub Actions
```

## 💡 Alternativa: Deployment Manual

Si prefieres no usar GitHub Actions por ahora, puedes hacer deployment manual:

```bash
# En tu máquina local
cd /Users/jnicolich/balanceChile

# Hacer build
cd client
npm run build
cd ..

# Crear ZIP
zip -r deploy.zip . -x "node_modules/*" -x "client/node_modules/*" -x ".git/*"

# Subir al servidor (via cPanel File Manager o SCP)
scp deploy.zip nicolic3@balancechile.nicolich.cl:/home/nicolic3/balancechile.nicolich.cl/

# Conectar al servidor
ssh nicolic3@balancechile.nicolich.cl

# En el servidor
cd balancechile.nicolich.cl
unzip -o deploy.zip
npm install --production
touch tmp/restart.txt
```

---

**¿Necesitas ayuda?** Revisa la documentación de tu hosting sobre cómo obtener acceso SSH.
