import * as dotenv from 'dotenv';
dotenv.config();

import { connect, Schema, Types } from 'mongoose';

const CLIENTE = '693a521908dee3020d1a6fe9';


async function runSeed() {
  const uri = process.env.MONGO_URI;

  if (!uri) throw new Error('❌ MONGO_URI no está definida');

  const conn = await connect(uri, { dbName: 'R3cl4mos' });
  console.log('🔗 Conectado a MongoDB');

  const Proyecto = conn.model(
    'Proyecto',
    new Schema(
      {
        titulo: { type: String, required: true },
        descripcion: { type: String, required: true },
        descripcionDetallada: { type: String },
        fechaInicio: { type: Date, required: true },
        tipo: { type: String, required: true },
        cliente: { type: Types.ObjectId, ref: 'Usuario', required: true },
      },
      { collection: 'proyectos', timestamps: true },
    ),
  );

  console.log('📌 Creando proyectos para Belén...');

  const proyectos = [
    {
      titulo: 'Sistema de Gestión de Reclamos',
      descripcion: 'Aplicación web para gestionar reclamos internos.',
      descripcionDetallada:
        'Incluye manejo de usuarios, roles, panel administrativo, seguimiento de reclamos y analíticas. Arquitectura modular en NestJS + MongoDB.',
      fechaInicio: new Date('2025-01-15'),
      tipo: 'Desarrollo de Software',
      cliente: CLIENTE,
    },
    {
      titulo: 'Plataforma de Automatización de Procesos',
      descripcion: 'Tool interna para automatizar workflows repetitivos.',
      descripcionDetallada:
        'Permite crear reglas, flujos automáticos, integraciones con APIs internas y generación de reportes. Basado en Node.js + microservicios.',
      fechaInicio: new Date('2025-03-01'),
      tipo: 'Desarrollo de Software',
      cliente: CLIENTE,
    },
  ];

  // Insertar proyectos evitando duplicados por título
  for (const p of proyectos) {
    const existe = await Proyecto.findOne({ titulo: p.titulo });

    if (existe) {
      console.log(`↪ Proyecto ya existe: ${p.titulo}`);
      continue;
    }

    await Proyecto.create(p);
    console.log(`✔ Proyecto creado: ${p.titulo}`);
  }

  console.log('\n🎉 SEED COMPLETO: Proyectos asignados correctamente a Belén');
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
