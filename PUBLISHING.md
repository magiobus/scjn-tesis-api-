# 📦 Guía de Publicación en NPM

## Pre-requisitos

1. **Cuenta en NPM**
   - Crear cuenta en https://www.npmjs.com/signup
   - Verificar email

2. **Login en NPM**
   ```bash
   npm login
   ```

## Pasos para Publicar

### 1. Verificar que todo funciona

```bash
# Instalar dependencias
npm install

# Ejecutar tests
npm test

# Ejecutar ejemplos
node examples/basic-search.js
```

### 2. Crear repositorio en GitHub

```bash
# Inicializar git
git init
git add .
git commit -m "feat: Initial release of scjn-tesis-api v1.0.0"

# Crear repo en GitHub y conectar
git remote add origin https://github.com/magiobus/scjn-tesis-api.git
git branch -M main
git push -u origin main
```

### 3. Actualizar package.json

Asegúrate de que estos campos estén correctos:
- `name`: "scjn-tesis-api"
- `version`: "1.0.0"
- `description`: Descripción clara
- `repository`: URL de GitHub
- `keywords`: Palabras clave relevantes
- `author`: Tu nombre
- `license`: "MIT"

### 4. Verificar archivos a publicar

```bash
# Ver qué archivos se incluirán
npm pack --dry-run
```

### 5. Publicar en NPM

```bash
# Primera publicación
npm publish

# Si quieres hacer un dry-run primero
npm publish --dry-run
```

### 6. Verificar publicación

```bash
# Ver en NPM
open https://www.npmjs.com/package/scjn-tesis-api

# Instalar desde NPM
npm install scjn-tesis-api
```

## Publicar Actualizaciones

### 1. Hacer cambios y commit

```bash
git add .
git commit -m "feat: New feature description"
```

### 2. Actualizar versión

```bash
# Patch (1.0.0 -> 1.0.1) - Bug fixes
npm version patch

# Minor (1.0.0 -> 1.1.0) - New features, backwards compatible
npm version minor

# Major (1.0.0 -> 2.0.0) - Breaking changes
npm version major
```

### 3. Push y publish

```bash
git push --tags
git push
npm publish
```

## Promoción

### 1. Anunciar en Redes Sociales

**Twitter/X**:
```
🚀 Acabo de lanzar scjn-tesis-api!

Un cliente Node.js para acceder programáticamente a más de 74,000 tesis del Semanario Judicial de la Federación 🇲🇽

✨ Paginación automática
⚡ Rate limiting inteligente
📊 Filtros avanzados
🔍 Búsqueda de tesis

npm install scjn-tesis-api

https://github.com/magiobus/scjn-tesis-api

#LegalTech #México #OpenSource
```

**Instagram**:
- Post con screenshot del código
- Casos de uso del paquete
- Story con link al repo

### 2. Reddit

- r/javascript
- r/node
- r/DerechoMexicano
- r/mexico

### 3. Dev.to / Medium

Escribir un artículo:
- "Cómo Crear un Cliente NPM para APIs Públicas"
- "Accediendo a Tesis del SCJN con Node.js"
- "Building an NPM Package for Legal Data"

### 4. LinkedIn

Post profesional sobre el proyecto:
- Problema que resuelve
- Tecnologías usadas
- Impacto potencial

### 5. Product Hunt

Lanzar el producto con:
- Descripción clara
- Screenshots
- Demo video (opcional)

## Métricas a Seguir

1. **NPM Stats**: Downloads semanales
2. **GitHub Stars**: Popularidad del repo
3. **Issues**: Problemas reportados
4. **Pull Requests**: Contribuciones

## Siguientes Pasos

1. Crear TypeScript definitions
2. Agregar más ejemplos
3. Mejorar documentación
4. Crear CLI tool
5. Build community

## Checklist Pre-Publicación

- [ ] Tests pasan
- [ ] README completo
- [ ] Ejemplos funcionan
- [ ] LICENSE agregado
- [ ] CHANGELOG actualizado
- [ ] package.json correcto
- [ ] .gitignore configurado
- [ ] GitHub repo creado
- [ ] npm login ejecutado
- [ ] Todo commiteado

¡Listo para publicar! 🚀
