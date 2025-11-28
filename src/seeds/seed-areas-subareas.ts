import * as dotenv from 'dotenv';
dotenv.config();

import { connect, Schema } from 'mongoose';

async function runSeed() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('❌ MONGO_URI no está definida en el entorno');
  }

  const conn = await connect(uri, { dbName: 'R3cl4mos' });
  console.log('🔗 Conectado a MongoDB');

  // MODELOS
  const Area = conn.model(
    'Area',
    new Schema(
      {
        nombre: { type: String, required: true, unique: true },
      },
      { collection: 'areas' },
    ),
  );

  const Subarea = conn.model(
    'Subarea',
    new Schema(
      {
        nombre: { type: String, required: true, unique: true },
        area: { type: Schema.Types.ObjectId, ref: 'Area', required: true },
      },
      { collection: 'subareas' },
    ),
  );

  // DATOS
  const areas = {
    Desarrollo: [
      'Backend',
      'Frontend',
      'Fullstack',
      'Mobile',
      'Testing',
      'DevOps',
    ],
    'UX/UI': ['Prototipado', 'Diseño UX', 'Diseño UI'],
    Producto: ['Product Manager', 'Product Owner', 'Scrum Master'],
    Infraestructura: [
      'Redes',
      'Infraestructura',
      'Ciberseguridad',
      'Soporte Técnico',
    ],
  };

  const areaIds = {};

  console.log('\n📌 Insertando ÁREAS...');

  // Crear Áreas
  for (const areaNombre of Object.keys(areas)) {
    let area = await Area.findOne({ nombre: areaNombre });

    if (!area) {
      area = await Area.create({ nombre: areaNombre });
      console.log(`✔ Área creada: ${areaNombre}`);
    } else {
      console.log(`↪ Área ya existía: ${areaNombre}`);
    }

    areaIds[areaNombre] = area._id;
  }

  console.log('\n📌 Insertando SUBÁREAS...');

  // Crear subáreas vinculadas a su área
  for (const [areaNombre, subareas] of Object.entries(areas)) {
    const areaId = areaIds[areaNombre];

    for (const subNombre of subareas) {
      let subarea = await Subarea.findOne({ nombre: subNombre });

      if (!subarea) {
        subarea = await Subarea.create({
          nombre: subNombre,
          area: areaId,
        });

        console.log(`   ✔ Subárea creada: ${subNombre} → (${areaNombre})`);
      } else {
        console.log(`   ↪ Subárea ya existía: ${subNombre}`);
      }
    }
  }

  console.log('\n🎉 SEED COMPLETO: Áreas y subáreas generadas correctamente');
  process.exit(0);
}

runSeed().catch((error) => {
  console.error('❌ Error en el seed:', error);
  process.exit(1);
});
