import * as dotenv from 'dotenv';
dotenv.config();

import { connect, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { TipoProyecto } from '../modules/proyectos/enums/TipoProyectoEnum';

// --------------------------------------------
// CONSTANTES
// --------------------------------------------
const ROL_CLIENTE = '692213cb7a194cd01af5059c';

// Lista genérica de nombres
const NOMBRES_CLIENTES = [
  'carlosperez',
  'mariafernandez',
  'juansosa',
  'lauradiaz',
  'martinrodriguez',
  'sofiaramirez',
  'lucasgomez',
  'anatorres',
  'diegoaguirre',
  'veronicapaz',
];

// Para generar títulos de proyectos al azar
const TIPOS_PROYECTO = Object.values(TipoProyecto);

// --------------------------------------------
// SCHEMAS DINÁMICOS
// --------------------------------------------
const usuarioSchema = new Schema(
  {
    nombreUsuario: String,
    email: String,
    contraseña: String,
    nombre: String,
    telefono: String,
    direccion: String,
    rol: { type: Types.ObjectId, ref: 'Rol' },
    area: { type: Types.ObjectId, ref: 'Area', default: null },
    subarea: { type: Types.ObjectId, ref: 'Subarea', default: null },
  },
  { collection: 'usuarios' },
);

const proyectoSchema = new Schema(
  {
    titulo: String,
    descripcion: String,
    descripcionDetallada: String,
    fechaInicio: Date,
    tipo: {
      type: String,
      enum: TIPOS_PROYECTO,
    },
    cliente: { type: Types.ObjectId, ref: 'Usuario', required: true },
  },
  { collection: 'proyectos', timestamps: true },
);

// --------------------------------------------
// HELPERS
// --------------------------------------------
function crearDescripcion(titulo: string) {
  return `Proyecto correspondiente a ${titulo.toLowerCase()}, solicitado por el cliente para mejorar sus procesos internos y modernizar su infraestructura digital.`;
}

function crearDescripcionDetallada(tipo: TipoProyecto) {
  return `Este proyecto se centra en el desarrollo de un sistema perteneciente a la categoría ${tipo}. Incluye relevamiento funcional, definición de alcance, arquitectura técnica, diseño de interfaces, desarrollo iterativo, pruebas funcionales y despliegue en entorno productivo. El proyecto contempla mantenimiento correctivo y evolutivo durante los primeros 6 meses.`;
}

function crearProyecto(clienteId: string, index: number) {
  const tipo =
    TIPOS_PROYECTO[Math.floor(Math.random() * TIPOS_PROYECTO.length)];
  const titulo = `Proyecto ${index} - ${tipo.replace(/_/g, ' ')}`;

  return {
    titulo,
    descripcion: crearDescripcion(titulo),
    descripcionDetallada: crearDescripcionDetallada(tipo),
    fechaInicio: new Date(),
    tipo,
    cliente: clienteId,
  };
}

// --------------------------------------------
// SEED PRINCIPAL
// --------------------------------------------
async function runSeed() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI no definida');

    const conn = await connect(uri, { dbName: 'R3cl4mos' });
    console.log('🔗 Conectado a MongoDB');

    const Usuario = conn.model('Usuario', usuarioSchema);
    const Proyecto = conn.model('Proyecto', proyectoSchema);

    const usuariosAInsertar: any[] = [];

    for (const nombre of NOMBRES_CLIENTES) {
      usuariosAInsertar.push({
        nombreUsuario: nombre,
        email: `${nombre}@gmail.com`,
        contraseña: nombre, // luego se hashea
        nombre,
        telefono: '351-5000000',
        direccion: 'Sin dirección',
        rol: ROL_CLIENTE,
        area: null,
        subarea: null,
      });
    }

    // Hash passwords
    for (const u of usuariosAInsertar) {
      u.contraseña = await bcrypt.hash(u.contraseña, 10);
    }

    const usuariosInsertados = await Usuario.insertMany(usuariosAInsertar);
    console.log('✔ 10 Usuarios cliente generados');

    const proyectosAInsertar: any[] = [];

    usuariosInsertados.forEach((usuario, idx) => {
      const p1 = crearProyecto(usuario._id.toString(), 1);
      const p2 = crearProyecto(usuario._id.toString(), 2);
      proyectosAInsertar.push(p1, p2);
    });

    await Proyecto.insertMany(proyectosAInsertar);
    console.log('✔ 20 Proyectos creados (2 por cliente)');

    console.log('🎉 Seed finalizado correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error ejecutando seed:', error);
    process.exit(1);
  }
}

runSeed();
