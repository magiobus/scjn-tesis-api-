# 🚀 Quick Start - scjn-tesis-api

Guía rápida para comenzar a usar el paquete.

## Instalación

```bash
npm install scjn-tesis-api
```

## Uso Básico

```javascript
const SCJNClient = require('scjn-tesis-api');

const client = new SCJNClient();

// Buscar tesis
const results = await client.search({
  epocas: ['12a'],
  size: 10
});

console.log(`Encontradas: ${results.totalElements} tesis`);
```

## Ejemplos Rápidos

### 1. Búsqueda Simple

```javascript
const client = new SCJNClient();

const results = await client.search({
  epocas: ['12a', '11a'],
  size: 20
});

results.documents.forEach(tesis => {
  console.log(`${tesis.ius}: ${tesis.rubro}`);
});
```

### 2. Buscar por Instancia

```javascript
const results = await client.search({
  epocas: ['12a'],
  instancias: ['Primera Sala'],
  size: 10
});
```

### 3. Obtener Tesis Específica

```javascript
// Usar número IUS
const tesis = await client.getTesis(2031337);

console.log(tesis.rubro);
console.log(tesis.epocaAbr);
console.log(tesis.instanciaAbr);
```

### 4. Extraer TODOS los IDs

```javascript
const allIds = await client.getAllTesisIds(
  { epocas: ['12a'] },
  {
    onProgress: (current, total) => {
      console.log(`${current}/${total} tesis`);
    }
  }
);

console.log(`Total: ${allIds.length} tesis`);
```

### 5. Health Check

```javascript
const health = await client.healthCheck();
console.log(health.status); // 'UP'
```

## Opciones de Configuración

```javascript
const client = new SCJNClient({
  timeout: 30000,           // ms
  retries: 3,
  maxConcurrent: 5,
  delayBetweenRequests: 100,
  debug: true               // Ver requests
});
```

## Clasificadores Disponibles

### Épocas
```javascript
'12a' // Duodécima Época
'11a' // Undécima Época
'10a' // Décima Época
'9a'  // Novena Época
```

### Instancias
```javascript
'Primera Sala'
'Segunda Sala'
'Pleno'
'Tribunales Colegiados'
'Plenos de Circuito'
'Plenos Regionales'
```

### Tipo de Documento
```javascript
'Tesis'
'Jurisprudencia'
```

## Errores Comunes

### 1. Timeout
```javascript
// Aumentar timeout para búsquedas grandes
const client = new SCJNClient({ timeout: 60000 });
```

### 2. Rate Limiting
```javascript
// Reducir concurrencia
const client = new SCJNClient({
  maxConcurrent: 2,
  delayBetweenRequests: 200
});
```

### 3. 404 en getTesis
```javascript
// Usar número IUS válido (obtenerlo de search primero)
const results = await client.search({ size: 1 });
const ius = results.documents[0].ius;
const tesis = await client.getTesis(ius);
```

## Modo Debug

```javascript
const client = new SCJNClient({ debug: true });

// O activar después
client.setDebug(true);
```

## Guardar Resultados

```javascript
const fs = require('fs');

const allIds = await client.getAllTesisIds({ epocas: ['12a'] });

// JSON
fs.writeFileSync('tesis.json', JSON.stringify(allIds, null, 2));

// CSV
const csv = allIds.map(t => `${t.ius},"${t.rubro}"`).join('\n');
fs.writeFileSync('tesis.csv', csv);
```

## Integración con Express

```javascript
const express = require('express');
const SCJNClient = require('scjn-tesis-api');

const app = express();
const client = new SCJNClient();

app.get('/search', async (req, res) => {
  try {
    const results = await client.search({
      epocas: req.query.epoca ? [req.query.epoca] : ['12a'],
      size: parseInt(req.query.size) || 20
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

## Testing

```bash
# Ejecutar tests
npm test

# Ejecutar ejemplos
node examples/basic-search.js
node examples/get-all-ids.js
node examples/advanced-filters.js
```

## Ayuda

- **Documentación**: [README.md](README.md)
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)
- **Issues**: https://github.com/magiobus/scjn-tesis-api/issues
- **NPM**: https://www.npmjs.com/package/scjn-tesis-api

---

¡Happy coding! 🎉
