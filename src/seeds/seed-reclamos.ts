import * as dotenv from 'dotenv';
dotenv.config();

import { connect, Schema, Types } from 'mongoose';

// ================================================
// CONSTANTES
// ================================================
const ESTADO_PENDIENTE_ID = '6921ce775659f081b8e59e5a';

// Áreas
const AREA_DESARROLLO = '69246b407d0518c5e0c46f82';
const AREA_UXUI = '69246b777d0518c5e0c46f83';
const AREA_PRODUCTO = '69246ba07d0518c5e0c46f84';
const AREA_INFRAESTRUCTURA = '69246bc07d0518c5e0c46f85';

const AREAS = [AREA_DESARROLLO, AREA_UXUI, AREA_PRODUCTO, AREA_INFRAESTRUCTURA];

// Proyectos proporcionados
const PROYECTO_IDS = [
  '693b15b3e153a1f502e6cc65',
  '693b15b3e153a1f502e6cc66',
  '693b15b3e153a1f502e6cc67',
  '693b15b3e153a1f502e6cc68',
  '693b15b3e153a1f502e6cc69',
  '693b15b3e153a1f502e6cc6a',
  '693b15b3e153a1f502e6cc6b',
  '693b15b3e153a1f502e6cc6c',
  '693b15b3e153a1f502e6cc6d',
  '693b15b3e153a1f502e6cc6e',
  '693b15b3e153a1f502e6cc6f',
  '693b15b3e153a1f502e6cc70',
  '693b15b3e153a1f502e6cc71',
  '693b15b3e153a1f502e6cc72',
];

// Tipos de reclamo (8)
const TIPOS_RECLAMO = [
  'Error de funcionalidad',
  'Bug visual o de interfaz',
  'Problema de login o autenticación',
  'Integración fallida con otro sistema',
  'Error en base de datos',
  'Problemas de rendimiento',
  'Notificaciones que no se envían',
  'Permisos o roles incorrectos',
];

// ================================================
// UTILIDADES
// ================================================
function generarNroTicket(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let txt = '';
  for (let i = 0; i < 4; i++) {
    txt += chars[Math.floor(Math.random() * chars.length)];
  }
  return txt;
}

function generarPrioridad() {
  const prioridades = ['Baja', 'Media', 'Alta'];
  return prioridades[Math.floor(Math.random() * prioridades.length)];
}

function criticidadSegunPrioridad(prioridad: string): number {
  switch (prioridad) {
    case 'Alta':
      return Math.floor(Math.random() * 3) + 8; // 8–10
    case 'Media':
      return Math.floor(Math.random() * 3) + 5; // 5–7
    case 'Baja':
      return Math.floor(Math.random() * 4) + 1; // 1–4
    default:
      return 5;
  }
}

function generarTitulo(tipo: string): string {
  const variaciones = [
    `Detectado ${tipo.toLowerCase()}`,
    `${tipo} en módulo crítico`,
    `${tipo} reportado por cliente`,
    `Incidencia: ${tipo.toLowerCase()}`,
  ];
  return variaciones[Math.floor(Math.random() * variaciones.length)];
}

function generarDescripcion(tipo: string): string {
  return `Se identifica un problema relacionado con ${tipo.toLowerCase()}, el cual requiere revisión para determinar la causa y resolverlo.`;
}

// ================================================
// SEED
// ================================================
async function runSeed() {
  const uri = process.env.MONGO_URI;

  if (!uri) throw new Error('❌ MONGO_URI no definida');

  const conn = await connect(uri, { dbName: 'R3cl4mos' });
  console.log('🔗 Conectado a MongoDB');

  // ============================================
  // MODELOS
  // ============================================
  const Proyecto = conn.model(
    'Proyecto',
    new Schema(
      {
        titulo: String,
        descripcion: String,
        descripcionDetallada: String,
        fechaInicio: Date,
        tipo: String,
        cliente: { type: Types.ObjectId, ref: 'Usuario' },
      },
      { collection: 'proyectos' },
    ),
  );

  const TipoReclamo = conn.model(
    'TipoReclamo',
    new Schema(
      {
        nombre: String,
      },
      { collection: 'tipo_reclamo' },
    ),
  );

  const Reclamo = conn.model(
    'Reclamo',
    new Schema(
      {
        nroTicket: String,
        titulo: String,
        tipoReclamo: { type: Types.ObjectId, ref: 'TipoReclamo' },
        prioridad: String,
        nivelCriticidad: Number,
        descripcion: String,
        historialAsignaciones: [
          { type: Types.ObjectId, ref: 'HistorialAsignacion' },
        ],
        historialEstados: [{ type: Types.ObjectId, ref: 'HistorialEstado' }],
        ultimoHistorialAsignacion: {
          type: Types.ObjectId,
          ref: 'HistorialAsignacion',
        },
        ultimoHistorialEstado: { type: Types.ObjectId, ref: 'HistorialEstado' },
        proyecto: { type: Types.ObjectId, ref: 'Proyecto' },
        usuario: { type: Types.ObjectId, ref: 'Usuario' },
        fechaCreacion: { type: Date, default: Date.now },
      },
      { collection: 'reclamos' },
    ),
  );

  const HistorialAsignacion = conn.model(
    'HistorialAsignacion',
    new Schema(
      {
        reclamo: { type: Types.ObjectId, ref: 'Reclamo', required: true },
        haciaArea: { type: Types.ObjectId, ref: 'Area', default: null },
        tipoAsignacion: { type: String, required: true },
        fechaAsignacion: { type: Date, default: Date.now },
      },
      { collection: 'historial_asignaciones' },
    ),
  );

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
        estado: { type: Types.ObjectId, ref: 'Estado', required: true },
      },
      { collection: 'historial_estado' },
    ),
  );

  // ============================================
  // Crear tipos de reclamo
  // ============================================
  console.log('📌 Creando tipos de reclamo...');
  await TipoReclamo.deleteMany({});

  const tiposInsertados = await TipoReclamo.insertMany(
    TIPOS_RECLAMO.map((nombre) => ({ nombre })),
  );

  console.log('✔ Tipos de reclamo creados.');

  // ============================================
  // Crear reclamos por proyecto
  // ============================================
  console.log('\n📌 Creando reclamos por proyecto...\n');

  for (const projectId of PROYECTO_IDS) {
    const proyecto = await Proyecto.findById(projectId);
    if (!proyecto) {
      console.log(`⚠ Proyecto no encontrado: ${projectId}`);
      continue;
    }

    const tipoRandom =
      tiposInsertados[Math.floor(Math.random() * tiposInsertados.length)];
    const prioridad = generarPrioridad();
    const criticidad = criticidadSegunPrioridad(prioridad);
    const titulo = generarTitulo(tipoRandom.nombre as string);
    const descripcion = generarDescripcion(tipoRandom.nombre as string);
    const nroTicket = generarNroTicket();

    // Crear reclamo
    const reclamo = await Reclamo.create({
      nroTicket,
      titulo,
      tipoReclamo: tipoRandom._id,
      prioridad,
      nivelCriticidad: criticidad,
      descripcion,
      proyecto: proyecto._id,
      usuario: proyecto.cliente, // Cliente del proyecto
    });

    // Crear historial de asignación inicial
    const areaAsignada = AREAS[Math.floor(Math.random() * AREAS.length)];

    const histAsig = await HistorialAsignacion.create({
      reclamo: reclamo._id,
      haciaArea: areaAsignada,
      tipoAsignacion: 'Inicial',
    });

    // Crear historial de estado inicial
    const histEstado = await HistorialEstado.create({
      reclamo: reclamo._id,
      estado: ESTADO_PENDIENTE_ID,
    });

    // Vincular historiales
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

    console.log(`✔ Reclamo creado para proyecto ${projectId}`);
    console.log(`  → Ticket: ${nroTicket}`);
    console.log(`  → Título: ${titulo}`);
    console.log(`  → Tipo: ${tipoRandom.nombre}`);
    console.log(`  → Área inicial: ${areaAsignada}`);
    console.log('');
  }

  console.log('🎉 SEED COMPLETO');
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
