import * as dotenv from 'dotenv';
dotenv.config();

import { connect } from 'mongoose';

async function runSeed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('❌ MONGO_URI no está definida en el entorno');
  }

  const conn = await connect(uri, { dbName: 'R3cl4mos' });

  const Estado = conn.model(
    'Estado',
    new conn.Schema({
      nombre: { type: String, required: true },
    }),
  );

  await Estado.insertMany([
    { nombre: 'Pendiente A Asignar' },
    { nombre: 'En proceso' },
    { nombre: 'Resuelto' },
  ]);

  console.log('✔ Datos iniciales insertados');
  process.exit(0);
}

runSeed();
