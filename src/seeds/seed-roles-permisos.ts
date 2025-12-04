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

  const Permiso = conn.model(
    'Permiso',
    new Schema({
      nombre: { type: String, required: true, unique: true },
      roles: [{ type: Schema.Types.ObjectId, ref: 'Rol' }],
    }),
  );

  const Rol = conn.model(
    'Rol',
    new Schema(
      {
        nombre: { type: String, required: true, unique: true },
        permisos: [{ type: Schema.Types.ObjectId, ref: 'Permiso' }],
      },
      { collection: 'roles' },
    ),
  );

  const permisosList = [
    'ASIGNAR RECLAMOS',
    'CREAR USUARIOS',
    'ELIMINAR USUARIOS',
    'EDITAR USUARIOS',
    'MOVER RECLAMO A SUBÁREA / ÁREA / EMPLEADO',
    'ASIGNAR RECLAMO A EMPLEADO',
    'CERRAR RECLAMO',
    'CREAR PROYECTOS',
    'ELIMINAR PROYECTOS',
    'EDITAR PROYECTOS',
    'AUTO-ASIGNAR RECLAMO',
    'REGISTRAR RECLAMO',
    'VISUALIZAR HISTORIAL',
    'CREAR FEEDBACK',
    'VER FEEDBACK',
    'VISUALIZAR ESTADO DE RECLAMO',
    'VER RECLAMO',
  ];

  console.log('📌 Insertando permisos...');

  const permisosMap = {};

  for (const nombre of permisosList) {
    let permiso = await Permiso.findOne({ nombre });

    if (!permiso) {
      permiso = await Permiso.create({ nombre });
      console.log(`✔ Permiso creado: ${nombre}`);
    } else {
      console.log(`↪ Permiso ya existía: ${nombre}`);
    }

    permisosMap[nombre] = permiso._id;
  }

  const roles = {
    ADMINISTRADOR: [
      'CREAR USUARIOS',
      'ELIMINAR USUARIOS',
      'EDITAR USUARIOS',
      'CREAR PROYECTOS',
      'ELIMINAR PROYECTOS',
      'EDITAR PROYECTOS',
      'VISUALIZAR HISTORIAL',
      'VER FEEDBACK',
    ],

    ENCARGADO_DE_ÁREA: [
      'ASIGNAR RECLAMOS',
      'CREAR USUARIOS',
      'ELIMINAR USUARIOS',
      'EDITAR USUARIOS',
      'MOVER RECLAMO A SUBÁREA / ÁREA / EMPLEADO',
      'ASIGNAR RECLAMO A EMPLEADO',
      'VISUALIZAR HISTORIAL',
      'VER RECLAMO',
    ],

    EMPLEADO: [
      'MOVER RECLAMO A SUBÁREA / ÁREA / EMPLEADO',
      'CERRAR RECLAMO',
      'AUTO-ASIGNAR RECLAMO',
      'VISUALIZAR HISTORIAL',
    ],

    CLIENTE: [
      'REGISTRAR RECLAMO',
      'VISUALIZAR ESTADO DE RECLAMO',
      'CREAR FEEDBACK',
    ],
  };

  console.log('\n📌 Insertando roles...');

  for (const [rolNombre, permisosDeRol] of Object.entries(roles)) {
    let rol = await Rol.findOne({ nombre: rolNombre });

    const permisosIds = permisosDeRol.map((p) => permisosMap[p]);

    if (!rol) {
      rol = await Rol.create({
        nombre: rolNombre,
        permisos: permisosIds,
      });

      console.log(`✔ Rol creado: ${rolNombre}`);
    } else {
      await Rol.updateOne(
        { _id: rol._id },
        { $set: { permisos: permisosIds } },
      );

      console.log(`↪ Rol ya existía, actualizado: ${rolNombre}`);
    }

    await Permiso.updateMany(
      { _id: { $in: permisosIds } },
      { $addToSet: { roles: rol._id } },
    );
  }

  console.log('\n🎉 SEED COMPLETO: Roles y permisos generados correctamente');
  process.exit(0);
}

runSeed().catch((error) => {
  console.error('❌ Error en el seed:', error);
  process.exit(1);
});
