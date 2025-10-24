/**
 * Ejemplo de búsquedas con filtros avanzados
 */
const SCJNClient = require('../src/index');

async function main() {
  const client = new SCJNClient({ debug: true });

  console.log('🎯 Búsquedas con filtros avanzados\n');

  try {
    // Ejemplo 1: Búsqueda específica por instancia
    console.log('1️⃣  Tesis de Primera Sala, época 12a');
    const primeraSala = await client.search({
      epocas: ['12a'],
      instancias: ['Primera Sala'],
      size: 3
    });
    console.log(`   Encontradas: ${primeraSala.totalElements} tesis\n`);

    // Ejemplo 2: Búsqueda por palabras clave
    console.log('2️⃣  Búsqueda de "derechos humanos"');
    const derechosHumanos = await client.search({
      searchTerms: 'derechos humanos',
      epocas: ['12a', '11a'],
      size: 3
    });
    console.log(`   Encontradas: ${derechosHumanos.totalElements} tesis\n`);

    // Ejemplo 3: Jurisprudencias en lugar de tesis
    console.log('3️⃣  Búsqueda de jurisprudencias');
    const jurisprudencias = await client.search({
      tipoDocumento: 'Jurisprudencia',
      epocas: ['12a'],
      size: 3
    });
    console.log(`   Encontradas: ${jurisprudencias.totalElements} jurisprudencias\n`);

    // Ejemplo 4: Obtener tesis específica por IUS
    console.log('4️⃣  Obtener tesis específica por IUS');

    // Primero buscar una tesis para obtener su IUS
    const searchResult = await client.search({ size: 1 });
    if (searchResult.documents && searchResult.documents.length > 0) {
      const firstDoc = searchResult.documents[0];
      const tesisDetail = await client.getTesis(firstDoc.ius);

      console.log(`   Rubro: ${tesisDetail.rubro}`);
      console.log(`   IUS: ${tesisDetail.ius}`);
      console.log(`   Época: ${tesisDetail.epocaAbr}`);
      console.log(`   Instancia: ${tesisDetail.instanciaAbr}`);
    }

    // Ejemplo 5: Health check
    console.log('\n5️⃣  Health check del servicio');
    const health = await client.healthCheck();
    console.log('   Estado:', health.status);
    console.log('   Componentes:', Object.keys(health.components).join(', '));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
