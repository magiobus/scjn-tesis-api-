/**
 * Ejemplo básico de búsqueda de tesis
 */
const SCJNClient = require('../src/index');

async function main() {
  // Crear cliente
  const client = new SCJNClient({
    debug: true // Habilitar logging
  });

  console.log('🔍 Búsqueda básica de tesis\n');

  try {
    // Búsqueda simple
    const results = await client.search({
      epocas: ['12a', '11a'], // Últimas dos épocas
      size: 5 // Solo 5 resultados para el ejemplo
    });

    console.log(`\n✅ Se encontraron ${results.totalElements} tesis\n`);

    // Mostrar primeros resultados
    if (results.documents && results.documents.length > 0) {
      console.log('📄 Primeros resultados:\n');
      results.documents.forEach((tesis, index) => {
        console.log(`${index + 1}. IUS: ${tesis.ius}`);
        console.log(`   Rubro: ${tesis.rubro.substring(0, 100)}...`);
        console.log(`   Época: ${tesis.epocaAbr}`);
        console.log('');
      });
    }

    // Mostrar facets disponibles
    if (results.classifiers) {
      console.log('\n📊 Clasificadores disponibles:');
      results.classifiers.forEach(classifier => {
        console.log(`\n${classifier.description}:`);
        if (classifier.facest) {
          classifier.facest.slice(0, 5).forEach(facet => {
            console.log(`  - ${facet.value}: ${facet.count} tesis`);
          });
        }
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
