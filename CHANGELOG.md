# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [1.0.0] - 2025-01-23

### ✨ Añadido
- Cliente principal `SCJNClient` con API intuitiva en español
- Método `search()` para búsqueda de tesis con filtros avanzados
- Método `getTesis(ius)` para obtener tesis individuales por número IUS
- Método `getAllTesisIds()` para extracción masiva con paginación automática
- Método `getAllIUS()` para obtener solo números IUS (más ligero)
- Método `healthCheck()` para verificar estado del servicio
- Sistema de rate limiting inteligente con `p-limit`
- Retry automático con exponential backoff usando `p-retry`
- Soporte para filtros por:
  - Épocas (9a, 10a, 11a, 12a)
  - Instancias (Primera Sala, Segunda Sala, Pleno, etc.)
  - Tipo de documento (Tesis, Jurisprudencia)
  - Términos de búsqueda libre
- Constants helpers para clasificadores legibles
- Paginación automática con callback de progreso
- Modo debug para logging detallado
- Ejemplos completos de uso
- Tests básicos
- Documentación completa en español

### 🔧 Configuración
- Timeout configurable (default: 30000ms)
- Número de reintentos configurable (default: 3)
- Concurrencia máxima configurable (default: 3)
- Delay entre requests configurable (default: 100ms)

### 📚 Documentación
- README completo con ejemplos
- Guía de instalación y uso rápido
- API reference detallada
- Ejemplos prácticos:
  - `basic-search.js` - Búsqueda básica
  - `get-all-ids.js` - Extracción masiva de IDs
  - `advanced-filters.js` - Filtros avanzados
- JSDoc en todos los métodos públicos

### 🧪 Testing
- Tests básicos funcionales
- Validación de endpoints principales
- Verificación de paginación

## [Unreleased]

### 🚀 Planeado
- Soporte para TypeScript definitions (.d.ts)
- Cache opcional con TTL configurable
- Stream API para extracción masiva
- CLI tool para búsquedas desde terminal
- Exportación a CSV/JSON/Excel
- Webhook notifications para nuevas tesis
- Búsqueda fuzzy y autocompletado
- Filtros adicionales por materia y año
