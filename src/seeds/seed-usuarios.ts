import * as dotenv from 'dotenv';
dotenv.config();

import { connect, Schema, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

// --------------------------------------------
//   MISMOS IDS QUE PASASTE
// --------------------------------------------

// ROLES
const ROL_ADMIN = '692213ca7a194cd01af50590';
const ROL_ENCARGADO = '692213ca7a194cd01af50594';
const ROL_EMPLEADO = '692213ca7a194cd01af50598';

// ÁREAS
const AREA_DESARROLLO = '69246b407d0518c5e0c46f82';
const AREA_INFRA = '69246b407d0518c5e0c46f82'; // mismo ID según tu mensaje

// SUBÁREAS
const SUB_BACKEND = '69246b417d0518c5e0c46f8f';
const SUB_FRONTEND = '69246b417d0518c5e0c46f92';
const SUB_REDES = '69246b447d0518c5e0c46fb3';

// --------------------------------------------
//   UTILIDAD: TU MISMO HASH PASSWORD
// --------------------------------------------
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function runSeed() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('❌ MONGO_URI no está definida');
  }

  const conn = await connect(uri, { dbName: 'R3cl4mos' });
  console.log('🔗 Conectado a MongoDB');

  // --------------------------------------------
  //   MODELO USUARIO
  // --------------------------------------------
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

  console.log('📌 Creando usuarios...');

  // --------------------------------------------
  //   LISTA DE USUARIOS A CREAR
  // --------------------------------------------
  const usuarios = [
    // ADMIN (sin área ni subárea)
    {
      nombreUsuario: 'admin',
      email: 'admin@empresa.com',
      contraseña: 'admin',
      nombre: 'Administrador General',
      rol: ROL_ADMIN,
      area: null,
      subarea: null,
    },

    // ENCARGADOS DE ÁREA (solo área)
    {
      nombreUsuario: 'martinlopez',
      email: 'martin.lopez@empresa.com',
      contraseña: 'martin',
      nombre: 'Martín López',
      rol: ROL_ENCARGADO,
      area: AREA_DESARROLLO,
      subarea: null,
    },
    {
      nombreUsuario: 'silviaruiz',
      email: 'silvia.ruiz@empresa.com',
      contraseña: 'silvia',
      nombre: 'Silvia Ruiz',
      rol: ROL_ENCARGADO,
      area: AREA_INFRA,
      subarea: null,
    },

    // EMPLEADOS (área + subárea)
    {
      nombreUsuario: 'juanperez',
      email: 'juan.perez@empresa.com',
      contraseña: 'juan',
      nombre: 'Juan Pérez',
      rol: ROL_EMPLEADO,
      area: AREA_DESARROLLO,
      subarea: SUB_BACKEND,
    },
    {
      nombreUsuario: 'lauradiaz',
      email: 'laura.diaz@empresa.com',
      contraseña: 'laura',
      nombre: 'Laura Díaz',
      rol: ROL_EMPLEADO,
      area: AREA_DESARROLLO,
      subarea: SUB_FRONTEND,
    },
    {
      nombreUsuario: 'carlosrodriguez',
      email: 'carlos.rodriguez@empresa.com',
      contraseña: 'carlos',
      nombre: 'Carlos Rodríguez',
      rol: ROL_EMPLEADO,
      area: AREA_INFRA,
      subarea: SUB_REDES,
    },
  ];

  // --------------------------------------------
  //   INSERTAR USUARIOS (HASHEANDO CONTRASEÑA)
  // --------------------------------------------
  for (const u of usuarios) {
    const yaExiste = await Usuario.findOne({ email: u.email });

    if (yaExiste) {
      console.log(`↪ Usuario ya existe: ${u.email}`);
      continue;
    }

    const hashed = await hashPassword(u.contraseña);

    await Usuario.create({
      ...u,
      contraseña: hashed,
    });

    console.log(`✔ Usuario creado: ${u.email}`);
  }

  console.log('\n🎉 SEED COMPLETO: Usuarios generados correctamente');
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('❌ Error en el seed:', err);
  process.exit(1);
});
