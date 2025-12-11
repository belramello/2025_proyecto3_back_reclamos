// seed/seed-tipos-reclamo.ts (Asegúrate de tener un archivo .env con MONGO_URI)

import * as dotenv from 'dotenv';
import { connect, Schema } from 'mongoose';
import { Types } from 'mongoose'; // Necesitamos Types para trabajar con ObjectId

// Cargar variables de entorno
dotenv.config();

// Definición de la interfaz del documento de TipoReclamo para usar en el script
interface ITipoReclamo extends Document {
    _id: Types.ObjectId;
    nombre: string;
    reclamos: Types.ObjectId[];
}

async function runSeed() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('❌ MONGO_URI no está definida en el entorno');
  }

  const conn = await connect(uri, { dbName: 'R3cl4mos' });

  console.log('🔗 Conectado a MongoDB');

  // ──────────────────────────────────────────────────────────
  // 2. DEFINICIÓN DEL MODELO (RUNTIME)
  // ──────────────────────────────────────────────────────────

  // Creamos el modelo TipoReclamo
  const TipoReclamoSchema = new Schema(
    {
      nombre: { type: String, required: true, unique: true },
      // Definición para array de referencias (ObjectId)
      reclamos: [{ type: Schema.Types.ObjectId, ref: 'Reclamo' }], 
    },
    { collection: 'tipo_reclamo', timestamps: true },
  );

  const TipoReclamoModel = conn.model<ITipoReclamo>('TipoReclamo', TipoReclamoSchema);

  // ──────────────────────────────────────────────────────────
  // 3. DATOS INICIALES Y ASIGNACIÓN DE IDS
  // ──────────────────────────────────────────────────────────

  const TIPOS_DE_RECLAMO_INICIALES = [
    { name: 'Error de Software', id: new Types.ObjectId() },
    { name: 'Fallo de Hardware', id: new Types.ObjectId() },
    { name: 'Solicitud de Cambio', id: new Types.ObjectId() },
    { name: 'Consulta General', id: new Types.ObjectId() },
  ];

  console.log('\n🗑️ Limpiando la colección "tipo_reclamo"...');
  await TipoReclamoModel.deleteMany({}); // Limpia la colección para evitar duplicados

  console.log('📌 Insertando Tipos de Reclamo...');

  for (const tipo of TIPOS_DE_RECLAMO_INICIALES) {
    // Usamos el ID pregenerado para asegurar que se cree como ObjectId
    // y para poder usarlo en referencias futuras si fuera necesario.
    let nuevoTipo = await TipoReclamoModel.create({
      _id: tipo.id, // 🌟 Asignamos la ID de tipo ObjectId
      nombre: tipo.name,
      reclamos: [],
    });
    
    console.log(`✔ Tipo creado con ObjectId(${nuevoTipo._id.toString()}): ${tipo.name}`);
  }

  // ──────────────────────────────────────────────────────────
  // 4. FINALIZACIÓN
  // ──────────────────────────────────────────────────────────
  console.log('\n🎉 SEED COMPLETO: Tipos de Reclamo iniciales generados.');
  process.exit(0);
}

runSeed().catch((error) => {
  console.error('❌ Error en el seed:', error);
  process.exit(1);
});