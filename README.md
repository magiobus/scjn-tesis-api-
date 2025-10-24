# 🇲🇽 scjn-tesis-api

Cliente Node.js no oficial para el API de tesis del Semanario Judicial de la Federación (SCJN México).

Accede programáticamente a más de 74,000 tesis y jurisprudencias de la Suprema Corte de Justicia de la Nación de México.

## ✨ Características

- 🚀 **Fácil de usar** - API intuitiva en español
- 📊 **Paginación automática** - Extrae miles de tesis sin complicaciones
- ⚡ **Rate limiting inteligente** - Evita saturar el servidor
- 🔄 **Retry automático** - Manejo de errores y reintentos
- 📦 **Zero config** - Funciona out of the box
- 🎯 **TypeScript ready** - Incluye JSDoc para autocompletado

## 📦 Instalación

```bash
npm install scjn-tesis-api
```

## 🚀 Uso Rápido

```javascript
const SCJNClient = require('scjn-tesis-api');

const client = new SCJNClient();

// Buscar tesis
const results = await client.search({
  epocas: ['12a', '11a'],
  searchTerms: 'amparo directo',
  size: 10
});

console.log(`Encontradas: ${results.totalElements} tesis`);
```

## 📖 Documentación

### Crear Cliente

```javascript
const client = new SCJNClient({
  timeout: 30000,           // Timeout en ms (default: 30000)
  retries: 3,               // Número de reintentos (default: 3)
  maxConcurrent: 3,         // Requests concurrentes (default: 3)
  delayBetweenRequests: 100, // Delay entre requests en ms (default: 100)
  debug: false              // Habilitar logging (default: false)
});
```

### Métodos Principales

#### `search(options)`

Busca tesis según filtros.

```javascript
const results = await client.search({
  epocas: ['12a', '11a', '10a', '9a'],  // Épocas a buscar
  instancias: ['Primera Sala'],          // Instancias específicas
  tipoDocumento: 'Tesis',                // 'Tesis' o 'Jurisprudencia'
  searchTerms: 'amparo',                 // Términos de búsqueda
  size: 100,                             // Resultados por página
  page: 0                                // Número de página
});

// Respuesta
{
  documents: [...],        // Array de tesis
  totalElements: 5234,     // Total de resultados
  totalPages: 53,          // Total de páginas
  classifiers: [...]       // Facets/clasificadores
}
```

#### `getTesis(id)`

Obtiene una tesis por su ID.

```javascript
const tesis = await client.getTesis('Aa88D5oB8-0TpTce0ffR');

console.log(tesis.rubro);
console.log(tesis.ius);
console.log(tesis.epocaAbr);
```

#### `getAllTesisIds(filters, options)`

Extrae TODOS los IDs de tesis según filtros. Perfecto para análisis de datos.

```javascript
const allIds = await client.getAllTesisIds(
  {
    epocas: ['12a'],
    tipoDocumento: 'Tesis'
  },
  {
    pageSize: 200,
    maxConcurrent: 5,
    onProgress: (current, total, page, totalPages) => {
      console.log(`Progreso: ${current}/${total}`);
    }
  }
);

// Retorna array de:
// [{ id: '...', ius: 2031337, rubro: '...' }, ...]
```

#### `healthCheck()`

Verifica el estado del servicio.

```javascript
const health = await client.healthCheck();
console.log(health.status); // 'UP'
```

### Clasificadores Disponibles

#### Épocas

```javascript
'12a' // Duodécima Época
'11a' // Undécima Época
'10a' // Décima Época
'9a'  // Novena Época
```

#### Instancias

```javascript
'Primera Sala'
'Segunda Sala'
'Pleno'
'Tribunales Colegiados'
'Plenos de Circuito'
'Plenos Regionales'
```

#### Tipo de Documento

```javascript
'Tesis'
'Jurisprudencia'
```

## 📚 Ejemplos

### Búsqueda Básica

```javascript
const client = new SCJNClient();

const results = await client.search({
  epocas: ['12a'],
  searchTerms: 'derechos humanos',
  size: 20
});

results.documents.forEach(tesis => {
  console.log(`IUS ${tesis.ius}: ${tesis.rubro}`);
});
```

### Extraer Todas las Tesis de una Época

```javascript
const allTesis = await client.getAllTesisIds(
  { epocas: ['12a'] },
  {
    onProgress: (current, total) => {
      console.log(`${current}/${total} tesis`);
    }
  }
);

// Guardar en JSON
const fs = require('fs');
fs.writeFileSync('tesis-12a.json', JSON.stringify(allTesis, null, 2));
```

### Búsqueda por Instancia Específica

```javascript
const primeraSala = await client.search({
  epocas: ['12a', '11a'],
  instancias: ['Primera Sala'],
  size: 50
});
```

### Obtener Múltiples Tesis

```javascript
const ids = ['id1', 'id2', 'id3'];
const tesisList = await client.getMultipleTesis(ids);
```

## 🎯 Casos de Uso

- 📊 **Análisis de datos legales** - Extrae y analiza tendencias jurisprudenciales
- 🤖 **Chatbots legales** - Integra con ChatGPT/Claude para asistentes legales
- 📱 **Apps móviles** - Crea apps de consulta de tesis
- 🔍 **Buscadores mejorados** - Mejora la experiencia de búsqueda oficial
- 📖 **Investigación académica** - Análisis de criterios judiciales

## ⚠️ Consideraciones

### Rate Limiting

El paquete incluye rate limiting por defecto para no saturar el servidor de la SCJN. Se recomienda:

- Máximo 5 requests concurrentes
- Delay mínimo de 100ms entre requests
- Para extracciones grandes, usar `pageSize: 200` y `maxConcurrent: 3`

### Uso Responsable

Este paquete accede a un API público del gobierno mexicano. Por favor:

- ✅ Usa rate limiting apropiado
- ✅ Cachea resultados cuando sea posible
- ✅ No hagas scraping agresivo
- ✅ Respeta los términos de uso de la SCJN

### Legalidad

Este es un cliente no oficial que accede a datos públicos del Poder Judicial de la Federación. Los datos pertenecen a la SCJN y están sujetos a sus términos de uso.

## 🛠️ Desarrollo

```bash
# Clonar repo
git clone https://github.com/magiobus/scjn-tesis-api.git
cd scjn-tesis-api

# Instalar dependencias
npm install

# Ejecutar ejemplos
node examples/basic-search.js
node examples/get-all-ids.js
node examples/advanced-filters.js
```

## 📊 Estadísticas del API

- **Total de tesis**: ~74,000
- **Épocas disponibles**: 9a, 10a, 11a, 12a
- **Instancias**: 8 principales
- **Tipos de documento**: Tesis y Jurisprudencias

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Changelog

### v1.0.0 (2025-01-XX)

- ✨ Release inicial
- 🔍 Búsqueda de tesis con filtros
- 📥 Extracción masiva de IDs
- ⚡ Rate limiting y retry logic
- 📖 Documentación completa en español

## 📄 Licencia

MIT © Magio Bustillos

## 🙏 Agradecimientos

- Datos proporcionados por la [Suprema Corte de Justicia de la Nación (SCJN)](https://www.scjn.gob.mx/)
- Construido con ❤️ para la comunidad legal y tech de México

## 📧 Contacto

- **Autor**: Magio Bustillos
- **Twitter**: [@magiobus](https://twitter.com/magiobus)
- **GitHub**: [@magiobus](https://github.com/magiobus)

---

**¿Te resultó útil?** ⭐ Dale una estrella al repo y compártelo con otros desarrolladores!
