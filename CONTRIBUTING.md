# Contribuir a Balance Chile

¡Gracias por tu interés en contribuir a Balance Chile! Este documento te guiará sobre cómo participar en el proyecto.

## 🚀 Formas de Contribuir

- **Reportar bugs** y problemas
- **Sugerir nuevas funcionalidades**
- **Mejorar la documentación**
- **Escribir código** (features, fixes, tests)
- **Mejorar el diseño** y UX
- **Traducir** a otros idiomas

## 🛠️ Configuración del Entorno de Desarrollo

1. **Fork** el repositorio en GitHub
2. **Clona** tu fork localmente:
   ```bash
   git clone https://github.com/tu-usuario/balance-chile.git
   cd balance-chile
   ```
3. **Instala** las dependencias:
   ```bash
   npm run install:all
   ```
4. **Ejecuta** en modo desarrollo:
   ```bash
   npm run dev
   ```

## 📝 Guías de Código

### Estilo de Código
- **Backend**: Sigue las convenciones de Node.js/Express
- **Frontend**: Usa ESLint y Prettier configurados
- **Commits**: Usa [Conventional Commits](https://conventionalcommits.org/)

### Estructura de Commits
```
tipo(scope): descripción

[cuerpo opcional]

[footer opcional]
```

Ejemplos:
```
feat(dashboard): agrega gráfico de evolución histórica
fix(api): corrige error en endpoint de ministerios
docs(readme): actualiza instrucciones de instalación
```

### Ramas
- `main`: Código estable en producción
- `develop`: Desarrollo activo
- `feature/nombre-feature`: Nuevas funcionalidades
- `fix/nombre-bug`: Corrección de bugs
- `docs/tema`: Mejoras de documentación

## 🧪 Testing

Asegúrate de que los tests pasen antes de hacer commit:

```bash
# Backend
cd backend && npm test

# Frontend  
cd frontend && npm test

# Todos los tests
npm test
```

Para nuevas funcionalidades, agrega tests correspondientes.

## 📋 Pull Request Process

1. **Actualiza** tu fork con los últimos cambios de `main`
2. **Crea** una rama para tu contribución
3. **Haz** tus cambios siguiendo las guías de código
4. **Agrega** tests si corresponde
5. **Actualiza** la documentación si es necesario
6. **Envía** un pull request con:
   - Título descriptivo
   - Descripción detallada de los cambios
   - Referencias a issues relacionados
   - Screenshots si aplica

### Template de Pull Request

```markdown
## Descripción
Breve descripción de los cambios realizados.

## Tipo de cambio
- [ ] Bug fix (cambio que corrige un issue)
- [ ] Nueva funcionalidad (cambio que agrega funcionalidad)
- [ ] Breaking change (cambio que rompe compatibilidad)
- [ ] Documentación

## Testing
- [ ] Los tests existentes pasan
- [ ] Agregué tests para mis cambios
- [ ] Probé manualmente los cambios

## Checklist
- [ ] Mi código sigue las guías de estilo
- [ ] Hice self-review de mi código
- [ ] Comenté código complejo si es necesario
- [ ] Actualicé la documentación
```

## 🐛 Reportar Bugs

Usa el [template de bug report](https://github.com/tu-usuario/balance-chile/issues/new?template=bug_report.md):

- **Descripción clara** del problema
- **Pasos para reproducir** el bug
- **Comportamiento esperado** vs actual
- **Screenshots** si aplica
- **Información del entorno** (OS, browser, versiones)

## 💡 Sugerir Features

Usa el [template de feature request](https://github.com/tu-usuario/balance-chile/issues/new?template=feature_request.md):

- **Descripción** de la funcionalidad
- **Justificación** (¿por qué es útil?)
- **Casos de uso** específicos
- **Mockups o wireframes** si tienes

## 🎨 Guías de Diseño

### UI/UX
- **Accesibilidad**: Cumplir WCAG 2.1 AA
- **Responsive**: Mobile-first design
- **Colores**: Usar la paleta definida (chile-red, primary-blue)
- **Tipografía**: Inter font family
- **Iconos**: Lucide React (consistencia)

### Datos
- **Precisión**: Validar datos con fuentes oficiales
- **Formato**: Usar formatters.js para consistencia
- **Cache**: Implementar cache apropiado para cada endpoint
- **Error Handling**: Manejar errores gracefully

## 🌍 Internacionalización

Actualmente en español, pero preparado para i18n:
- Usa constantes para strings
- Evita texto hardcodeado en componentes
- Considera formatos de fecha/número locales

## 📊 Datos y APIs

### Fuentes Oficiales
- **DIPRES**: Presupuesto nacional
- **Banco Central**: Indicadores económicos  
- **datos.gob.cl**: Datasets abiertos
- **INE**: Estadísticas nacionales

### Principios
- **Transparencia**: Citar siempre las fuentes
- **Actualización**: Datos lo más actuales posible
- **Validación**: Verificar consistencia de datos
- **Backup**: Modo demo si APIs fallan

## 🔒 Seguridad

Si encuentras vulnerabilidades de seguridad:
1. **NO** abras un issue público
2. **Envía** un email a: security@balancechile.cl
3. **Incluye** detalles de la vulnerabilidad
4. **Espera** nuestra respuesta antes de divulgar

## 📞 Contacto

- **Issues**: Para bugs y features
- **Discussions**: Para preguntas generales
- **Email**: contact@balancechile.cl
- **Twitter**: [@BalanceChile](https://twitter.com/balancechile)

## 🏆 Reconocimiento

Los contribuidores aparecen en:
- README.md (sección de agradecimientos)
- Página "Acerca de" en la aplicación
- Releases notes para contribuciones importantes

## 📜 Código de Conducta

Este proyecto sigue el [Contributor Covenant](CODE_OF_CONDUCT.md). Al participar, te comprometes a mantener un ambiente respetuoso y acogedor para todos.

---

¡Gracias por contribuir a la transparencia fiscal en Chile! 🇨🇱
