import * as dotenv from 'dotenv';
dotenv.config();

import { connect, Schema, Types } from 'mongoose';

// --------------------------------------------
// CONSTANTES
// --------------------------------------------
const AREA_DESTINO = '69246b407d0518c5e0c46f82';
const ESTADO_PENDIENTE_ID = '6921ce775659f081b8e59e5a';

// Para prioridades y creación de títulos
const PRIORIDADES = ['bajo', 'medio', 'alto'];
const TITULOS_EJEMPLO = [
  'Falla en sistema eléctrico',
  'Inconveniente con la red de datos',
  'Problema de acceso al sistema',
  'Revisión de infraestructura',
  'Solicitud de mantenimiento preventivo',
];

// --------------------------------------------
// MODELOS
// --------------------------------------------

async function runSeed() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('❌ MONGO_URI no definida');

  const conn = await connect(uri, { dbName: 'R3cl4mos' });
  console.log('🔗 Conectado a MongoDB');

  // Reclamo
  const Reclamo = conn.model(
    'Reclamo',
    new Schema(
      {
        nroTicket: String,
        titulo: String,
        tipoReclamo: { type: Types.ObjectId, default: null },
        prioridad: { type: String, required: true },
        nivelCriticidad: { type: Number, required: true },
        historialAsignaciones: [
          { type: Types.ObjectId, ref: 'HistorialAsignacion' },
        ],
        historialEstados: [{ type: Types.ObjectId, ref: 'HistorialEstado' }],
        ultimoHistorialAsignacion: {
          type: Types.ObjectId,
          ref: 'HistorialAsignacion',
        },
        ultimoHistorialEstado: { type: Types.ObjectId, ref: 'HistorialEstado' },
        proyecto: Number,
        descripcion: String,
        imagenUrl: String,
        resumenResolucion: String,
        fechaCreacion: { type: Date, default: Date.now },
        fechaEliminacion: { type: Date, default: null },
      },
      { collection: 'reclamos' },
    ),
  );

  // Historial Asignación
  const HistorialAsignacion = conn.model(
    'HistorialAsignacion',
    new Schema(
      {
        reclamo: { type: Types.ObjectId, ref: 'Reclamo', required: true },
        desdeArea: { type: Types.ObjectId, ref: 'Area', default: null },
        haciaArea: { type: Types.ObjectId, ref: 'Area', default: null },
        desdeSubarea: { type: Types.ObjectId, ref: 'Subarea', default: null },
        haciaSubarea: { type: Types.ObjectId, ref: 'Subarea', default: null },
        deEmpleado: { type: Types.ObjectId, ref: 'Usuario', default: null },
        haciaEmpleado: { type: Types.ObjectId, ref: 'Usuario', default: null },
        fechaAsignacion: { type: Date, default: Date.now },
        tipoAsignacion: { type: String, required: true },
        comentario: { type: String, default: null },
      },
      { collection: 'historial_asignaciones' },
    ),
  );

  // Historial Estado
  const HistorialEstado = conn.model(
    'HistorialEstado',
    new Schema(
      {
        reclamo: { type: Types.ObjectId, ref: 'Reclamo', required: true },
        usuarioResponsable: {
          type: Types.ObjectId,
          ref: 'Usuario',
          default: null,
        },
        fechaHoraInicio: { type: Date, default: Date.now },
        fechaHoraFin: { type: Date, default: null },
        estado: { type: Types.ObjectId, ref: 'Estado', required: true },
      },
      { collection: 'historial_estado' },
    ),
  );

  console.log('📌 Creando Reclamos...');

  // --------------------------------------------
  //  CREAR 5 RECLAMOS
  // --------------------------------------------
  for (let i = 1; i <= 10; i++) {
    const nroTicket = `TCK-${String(i).padStart(4, '0')}`;

    const prioridad =
      PRIORIDADES[Math.floor(Math.random() * PRIORIDADES.length)];
    const nivelCriticidad = Math.floor(Math.random() * 5) + 1;
    const titulo =
      TITULOS_EJEMPLO[Math.floor(Math.random() * TITULOS_EJEMPLO.length)];

    // Crear reclamo base
    const reclamo = await Reclamo.create({
      nroTicket,
      titulo,
      prioridad,
      nivelCriticidad,
      tipoReclamo: null,
      proyecto: null,
      descripcion: `Reclamo generado automáticamente (${nroTicket})`,
    });

    // Crear historial de asignación inicial
    const histAsig = await HistorialAsignacion.create({
      reclamo: reclamo._id,
      desdeArea: null,
      haciaArea: AREA_DESTINO,
      tipoAsignacion: 'Inicial',
    });

    // Crear historial de estado inicial
    const histEstado = await HistorialEstado.create({
      reclamo: reclamo._id,
      estado: ESTADO_PENDIENTE_ID,
      usuarioResponsable: null,
    });

    await Reclamo.updateOne(
      { _id: reclamo._id },
      {
        $set: {
          ultimoHistorialAsignacion: histAsig._id,
          ultimoHistorialEstado: histEstado._id,
        },
        $push: {
          historialAsignaciones: histAsig._id,
          historialEstados: histEstado._id,
        },
      },
    );

    await reclamo.save();

    console.log(`✔ Reclamo creado: ${nroTicket}`);
    console.log(`   → Título: ${titulo}`);
    console.log(`   → Prioridad: ${prioridad}`);
    console.log(`   → Criticidad: ${nivelCriticidad}\n`);
  }

  console.log('🎉 SEED COMPLETO: 5 reclamos generados correctamente');
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
