/**
 * Tests básicos para scjn-tesis-api
 */
const SCJNClient = require('../src/index');

async function runTests() {
  console.log('🧪 Ejecutando tests básicos\n');

  const client = new SCJNClient({ debug: false });
  let passed = 0;
  let failed = 0;

  // Test 1: Health Check
  try {
    console.log('Test 1: Health Check... ');
    const health = await client.healthCheck();
    if (health.status === 'UP') {
      console.log('✅ PASSED');
      passed++;
    } else {
      console.log('❌ FAILED - Service not UP');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAILED -', error.message);
    failed++;
  }

  // Test 2: Búsqueda básica
  try {
    console.log('Test 2: Búsqueda básica... ');
    const results = await client.search({ size: 1 });
    if (results.documents && results.documents.length > 0) {
      console.log('✅ PASSED');
      passed++;
    } else {
      console.log('❌ FAILED - No documents returned');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAILED -', error.message);
    failed++;
  }

  // Test 3: Búsqueda con filtros
  try {
    console.log('Test 3: Búsqueda con filtros... ');
    const results = await client.search({
      epocas: ['12a'],
      size: 1
    });
    if (results.totalElements > 0) {
      console.log('✅ PASSED');
      passed++;
    } else {
      console.log('❌ FAILED - No results');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAILED -', error.message);
    failed++;
  }

  // Test 4: getTesis
  try {
    console.log('Test 4: Obtener tesis por IUS... ');
    // Primero buscar una para obtener IUS válido
    const searchResult = await client.search({ size: 1 });
    if (searchResult.documents && searchResult.documents.length > 0) {
      const ius = searchResult.documents[0].ius;
      const tesis = await client.getTesis(ius);
      if (tesis.ius) {
        console.log('✅ PASSED');
        passed++;
      } else {
        console.log('❌ FAILED - Invalid tesis data');
        failed++;
      }
    } else {
      console.log('❌ FAILED - Could not get test IUS');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAILED -', error.message);
    failed++;
  }

  // Test 5: Paginación
  try {
    console.log('Test 5: Paginación... ');
    const page1 = await client.search({ size: 2, page: 0 });
    const page2 = await client.search({ size: 2, page: 1 });

    if (page1.documents[0].id !== page2.documents[0].id) {
      console.log('✅ PASSED');
      passed++;
    } else {
      console.log('❌ FAILED - Pages are identical');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAILED -', error.message);
    failed++;
  }

  // Resultados
  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 Resultados: ${passed} passed, ${failed} failed`);
  console.log(`✅ Success rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%\n`);

  if (failed === 0) {
    console.log('🎉 ¡Todos los tests pasaron!');
    process.exit(0);
  } else {
    console.log('⚠️  Algunos tests fallaron');
    process.exit(1);
  }
}

runTests().catch(error => {
  console.error('❌ Error ejecutando tests:', error);
  process.exit(1);
});
