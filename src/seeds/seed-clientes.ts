import * as dotenv from 'dotenv';
dotenv.config();

import { connect, Schema, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

const ROL_CLIENTE = '693a4f2ccf7e16b0abbe2bd0';
const ROL_ADMINISTRADOR = '693a4f2ccf7e16b0abbe2bc4';

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function runSeed() {
  const uri = process.env.MONGO_URI;

  if (!uri) throw new Error('❌ MONGO_URI no está definida');

  const conn = await connect(uri, { dbName: 'R3cl4mos' });
  console.log('🔗 Conectado a MongoDB');

  const Usuario = conn.model(
    'Usuario',
    new Schema(
      {
        nombreUsuario: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        contraseña: { type: String, required: true },
        rol: { type: Types.ObjectId, ref: 'Rol', required: true },
        nombre: String,
        area: { type: Types.ObjectId, ref: 'Area', default: null },
        subarea: { type: Types.ObjectId, ref: 'Subarea', default: null },
      },
      { collection: 'usuarios' },
    ),
  );

  console.log('📌 Creando usuarios CLIENTE...');

  const clientes = [
    {
      nombreUsuario: 'belenramello',
      email: 'belenramello@gmail.com',
      contraseña: 'belen123',
      nombre: 'Belen Ramello',
      rol: ROL_CLIENTE,
      area: null,
      subarea: null,
    },
    {
      nombreUsuario: 'cazzu',
      email: 'cazzu@gmail.com',
      contraseña: 'cazzu123',
      nombre: 'Cazzu',
      rol: ROL_CLIENTE,
      area: null,
      subarea: null,
    },
  ];

  // ✅ ADMIN SEPARADO
  const admin = {
    nombreUsuario: 'admin',
    email: 'admin@admin.com',
    contraseña: 'admin123',
    nombre: 'Administrador General',
    rol: ROL_ADMINISTRADOR,
    area: null,
    subarea: null,
  };

  // --------------------------------------------
  //   CREAR CLIENTES
  // --------------------------------------------
  for (const c of clientes) {
    const existe = await Usuario.findOne({ email: c.email });

    if (existe) {
      console.log(`↪ Ya existe: ${c.email}`);
      continue;
    }

    const hashed = await hashPassword(c.contraseña);

    await Usuario.create({
      ...c,
      contraseña: hashed,
    });

    console.log(`✔ Cliente creado: ${c.email}`);
  }

  // --------------------------------------------
  //   CREAR ADMIN
  // --------------------------------------------
  console.log('\n📌 Creando ADMIN...');

  const existeAdmin = await Usuario.findOne({ email: admin.email });

  if (existeAdmin) {
    console.log(`↪ Ya existe el admin: ${admin.email}`);
  } else {
    const hashedAdmin = await hashPassword(admin.contraseña);

    await Usuario.create({
      ...admin,
      contraseña: hashedAdmin,
    });

    console.log(`✔ Admin creado: ${admin.email}`);
  }

  console.log('\n🎉 SEED COMPLETO: Usuarios generados correctamente');
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('❌ Error en el seed:', err);
  process.exit(1);
});
