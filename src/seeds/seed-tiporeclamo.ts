
import * as dotenv from 'dotenv';
import { connect, Schema, Types, Document } from 'mongoose';

dotenv.config();

interface ITipoReclamo extends Document {
  _id: Types.ObjectId;
  nombre: string;
  reclamos: Types.ObjectId[];
  area: Types.ObjectId;
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

  const TipoReclamoSchema = new Schema(
    {
      nombre: { type: String, required: true, unique: true },
      reclamos: [{ type: Schema.Types.ObjectId, ref: 'Reclamo' }],
      area: { type: Schema.Types.ObjectId, ref: 'Area', required: true }, // 👈 agregado
    },
    { collection: 'tipo_reclamo', timestamps: true },
  );

  const TipoReclamoModel = conn.model<ITipoReclamo>('TipoReclamo', TipoReclamoSchema);

  // ──────────────────────────────────────────────────────────
  // 3. DATOS INICIALES Y ASIGNACIÓN DE IDS
  // ──────────────────────────────────────────────────────────

  // IDs de áreas ya existentes en tu base
  const AREA_PRODUCTO_ID = new Types.ObjectId('693a4ef79be9ee86380af4b3');
  const AREA_INFRA_ID = new Types.ObjectId('693a4ef79be9ee86380af4b6');

  const TIPOS_DE_RECLAMO_INICIALES = [
    { name: 'Error de Software', id: new Types.ObjectId(), area: AREA_PRODUCTO_ID },
    { name: 'Fallo de Hardware', id: new Types.ObjectId(), area: AREA_INFRA_ID },
    { name: 'Solicitud de Cambio', id: new Types.ObjectId(), area: AREA_PRODUCTO_ID },
    { name: 'Consulta General', id: new Types.ObjectId(), area: AREA_INFRA_ID },
  ];

  console.log('\n🗑️ Limpiando la colección "tipo_reclamo"...');
  await TipoReclamoModel.deleteMany({}); // Limpia la colección para evitar duplicados

  console.log('📌 Insertando Tipos de Reclamo...');

  for (const tipo of TIPOS_DE_RECLAMO_INICIALES) {
    let nuevoTipo = await TipoReclamoModel.create({
      _id: tipo.id,
      nombre: tipo.name,
      reclamos: [],
      area: tipo.area, // 👈 vinculamos cada tipo a un área
    });

    console.log(
      `✔ Tipo creado con ObjectId(${nuevoTipo._id.toString()}): ${tipo.name} → Área ${tipo.area.toString()}`,
    );
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
