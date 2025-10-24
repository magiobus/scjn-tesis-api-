# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**scjn-tesis-api** is a Node.js client library for accessing the Mexican Supreme Court (SCJN) thesis database API. It provides programmatic access to over 74,000 legal theses and jurisprudence documents from the Semanario Judicial de la Federación.

## Development Commands

### Testing
```bash
npm test                          # Run basic tests (tests/basic.test.js)
```

### Examples
```bash
node examples/basic-search.js     # Basic search example
node examples/get-all-ids.js      # Mass ID extraction example
node examples/advanced-filters.js # Advanced filtering example
node demo.js                      # Comprehensive demo
```

## Architecture

### Core Design Pattern

The library uses a **layered architecture** with clear separation of concerns:

1. **Client Layer** (`SCJNClient.js`) - Main entry point, orchestrates utilities
2. **Endpoint Layer** (`endpoints/`) - API endpoint handlers (search, getTesis, health)
3. **Utility Layer** (`utils/`) - HTTP client, rate limiter, paginator
4. **Constants Layer** (`constants/`) - Classifiers, endpoints, mappings

### Critical Architecture Details

#### Classifier Translation System
The SCJN API uses numeric codes for epochs, instances, and document types. The library translates human-readable names to codes:

- **Epochs**: `'12a'` → `'210'`, `'11a'` → `'200'`, etc. (see `constants/classifiers.js`)
- **Instances**: `'Primera Sala'` → `'1'`, `'Pleno'` → `'6'`, etc.
- **Document Types**: `'Tesis'` → `'1'`, `'Jurisprudencia'` → `'2'`

The `buildSearchPayload()` function in `endpoints/search.js` constructs the complex payload structure required by the API, including:
- Classifiers array with name/value pairs
- Default instance codes when none specified: `['6', '60', '7', '70', '80', '1', '2', '50']`
- Label generation for UI display

#### HTTP Client with Retry Logic
`utils/http.js` wraps axios with `p-retry` for automatic retry on transient failures:

- **4xx errors** → AbortError (no retry)
- **5xx/network errors** → Retry up to 3 times with 1s delay
- Debug mode logs all requests and retry attempts

#### Rate Limiting System
`utils/rate-limiter.js` uses `p-limit` to control concurrency:

- Prevents overwhelming the SCJN server
- Default: max 3 concurrent requests with 100ms delay
- Configurable via `SCJNClient` constructor options

#### Pagination System
`utils/paginator.js` handles automatic pagination for mass data extraction:

1. Initial request to get `totalElements`
2. Calculate required pages based on `pageSize`
3. Execute all page requests with rate limiting via `runAll()`
4. Progress callbacks: `(current, total, page, totalPages)`
5. Returns flattened array of results

### Data Flow for Search Operations

```
search() → buildSearchPayload() → HttpClient.post()
                ↓
         convertirEpocas()
         convertirInstancias()
         convertirTipoDocumento()
         generarLabels()
```

### Data Flow for Mass Extraction

```
getAllTesisIds() → Paginator
                      ↓
              Initial request (size=1)
                      ↓
              Calculate totalPages
                      ↓
              RateLimiter.runAll([pageFn1, pageFn2, ...])
                      ↓
              Flatten results
```

## Key Implementation Notes

### API Endpoint Details
- **Base URL**: `https://sjf2.scjn.gob.mx/services/sjftesismicroservice/api/public`
- **Search**: POST `/tesis?size=X&page=Y` with payload
- **Get Tesis**: GET `/tesis/{ius}` (uses IUS number, not document ID)
- **Health**: GET `/health`

### IUS vs Document ID

**⚠️ CRITICAL**: This is the most common source of errors in the library.

The API has two identifiers for each thesis:
- **`id`**: Internal Elasticsearch document ID (e.g., `'Aa88D5oB8-0TpTce0ffR'`) - String type
- **`ius`**: Public thesis number (e.g., `2031337`) - Number type

**Key Facts**:
1. `getTesis()` requires the **`ius`** number, NOT the document `id`
2. `getAllTesisIds()` returns objects with BOTH `{ id, ius, rubro }`
3. To use results from `getAllTesisIds()` with `getTesis()`, use the `ius` field:
   ```javascript
   const allIds = await client.getAllTesisIds({ epocas: ['12a'] });
   const tesis = await client.getTesis(allIds[0].ius);  // ✅ Correct
   // NOT: await client.getTesis(allIds[0].id);  // ❌ Will fail with 404
   ```

**Historical Bug**: Early versions of `examples/advanced-filters.js` incorrectly used `firstDoc.id` instead of `firstDoc.ius`, causing 404 errors. This has been fixed.

### CommonJS Module System
The library uses CommonJS (require/module.exports) for Node.js 14+ compatibility. This was chosen over ESM because:
- `p-retry` v4 uses CommonJS (v5 requires ESM)
- Maximum compatibility with older Node.js projects
- Simpler for consumers who may not use ESM

### Error Handling Strategy
- Network/5xx errors: Automatic retry (3 attempts)
- 4xx errors: No retry, throw immediately
- Missing required IUS: 404 error from API
- Invalid searchTerms: May return 400 from API (edge case)

## Testing Notes

Tests are basic functional tests in `tests/basic.test.js`. Known issues:
- Edge cases with searchTerms can fail (API sensitivity)
- getTesis requires valid IUS numbers from real data
- Current success rate: ~60% (3/5 tests passing)

To run a single test function, modify `tests/basic.test.js` and comment out unwanted test calls.

## Dependencies

- **axios** (^1.7.7): HTTP client
- **p-limit** (^3.1.0): Concurrency control
- **p-retry** (^4.6.2): Retry logic

All dependencies are production-ready with no known vulnerabilities.

## Spanish Language Context

This library serves the Mexican legal community. All user-facing content (documentation, variable names, examples) is in Spanish. Keep this cultural context when:
- Writing documentation or examples
- Naming new functions or variables
- Creating error messages
- Writing commit messages (preferably in Spanish)
