/**
 * Ejemplo de extracción de todos los IDs de tesis
 */
const SCJNClient = require('../src/index');

async function main() {
  const client = new SCJNClient({
    maxConcurrent: 5, // Más requests concurrentes para ir más rápido
    debug: false
  });

  console.log('📥 Extrayendo todos los IDs de tesis de la 12a Época\n');

  try {
    const startTime = Date.now();

    // Obtener todos los IDs con progress bar
    const allIds = await client.getAllTesisIds(
      {
        epocas: ['12a'], // Solo 12a época (más rápido para el ejemplo)
        tipoDocumento: 'Tesis'
      },
      {
        pageSize: 200, // Páginas más grandes = menos requests
        maxConcurrent: 5,
        onProgress: (current, total, page, totalPages) => {
          const percentage = ((current / total) * 100).toFixed(1);
          const bar = '█'.repeat(Math.floor(percentage / 2)) + '░'.repeat(50 - Math.floor(percentage / 2));
          process.stdout.write(`\r[${bar}] ${percentage}% | ${current}/${total} tesis | Página ${page}/${totalPages}`);
        }
      }
    );

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n\n✅ Extracción completada!');
    console.log(`📊 Total de tesis: ${allIds.length}`);
    console.log(`⏱️  Tiempo: ${duration} segundos`);
    console.log(`⚡ Velocidad: ${(allIds.length / duration).toFixed(0)} tesis/segundo`);

    // Mostrar ejemplos
    console.log('\n📄 Primeras 5 tesis:');
    allIds.slice(0, 5).forEach((tesis, index) => {
      console.log(`${index + 1}. IUS ${tesis.ius} - ${tesis.rubro.substring(0, 60)}...`);
    });

    // Guardar en archivo JSON (opcional)
    // const fs = require('fs');
    // fs.writeFileSync('tesis-ids.json', JSON.stringify(allIds, null, 2));
    // console.log('\n💾 IDs guardados en tesis-ids.json');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

main();
