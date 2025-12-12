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

  const TipoReclamo = conn.model(
    'TipoReclamo',
    new Schema(
      {
        nombre: { type: String, required: true, unique: true },
        reclamos: [{ type: Schema.Types.ObjectId, ref: 'Reclamo' }],
        area: { type: Schema.Types.ObjectId, ref: 'Area', required: false },
      },
      { collection: 'tipo_reclamo' },
    ),
  );

  // ASIGNACIÓN
  const TIPOS_RECLAMO_CON_AREA = [
    { nombre: 'Error de funcionalidad', areaNombre: 'Desarrollo' },
    { nombre: 'Bug visual o de interfaz', areaNombre: 'UX/UI' },
    { nombre: 'Problema de login o autenticación', areaNombre: 'Desarrollo' },
    {
      nombre: 'Integración fallida con otro sistema',
      areaNombre: 'Desarrollo',
    },
    { nombre: 'Error en base de datos', areaNombre: 'Infraestructura' },
    { nombre: 'Problemas de rendimiento', areaNombre: 'Infraestructura' },
    { nombre: 'Notificaciones que no se envían', areaNombre: 'Producto' },
    { nombre: 'Permisos o roles incorrectos', areaNombre: 'Producto' },
  ];

  console.log('\n📌 Actualizando TIPOS DE RECLAMO existentes...');

  for (const item of TIPOS_RECLAMO_CON_AREA) {
    const area = await Area.findOne({ nombre: item.areaNombre });

    if (!area) {
      console.log(`❌ Área no encontrada: ${item.areaNombre}. Saltando...`);
      continue;
    }

    // Buscar el tipo de reclamo existente
    const tipo = await TipoReclamo.findOne({ nombre: item.nombre });

    if (!tipo) {
      console.log(
        `⚠ Tipo de reclamo no encontrado (no se crea): ${item.nombre}`,
      );
      continue;
    }

    // Actualizar área
    tipo.area = area._id;
    await tipo.save();

    console.log(`✔ Actualizado: ${item.nombre} → Área: ${item.areaNombre}`);
  }

  console.log(
    '\n🎉 SEED COMPLETO: Tipos de reclamo actualizados correctamente.',
  );
  process.exit(0);
}

runSeed().catch((error) => {
  console.error('❌ Error en el seed:', error);
  process.exit(1);
});
